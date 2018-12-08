import { DBManager} from './DBManager'
import Logger from '@machinomy/logger'
import { BigNumber } from 'bignumber.js'
import Options from './config/Options'
import { BotRecord } from './entity/BotRecord'
import { Registry } from './Registry'
import axios from 'axios'
import EventEmitter = NodeJS.EventEmitter

export class Main {
  registry: Registry
  log: Logger

  constructor (options: Options) {
    this.registry = new Registry(options)
    this.log = new Logger('main')
  }

  async run (): Promise<void> {
    const httpsEndpoint = await this.registry.httpsEndpoint()
    await httpsEndpoint.listen()

    const twitterStream = this.registry.twitterStream()
    twitterStream.on('tweet', async (tweet: any) => {
      const twit = this.registry.twit()

      const tweetId = '1071455689049022500'
      const sourceAccount = 'zx10020'
      const destinationAccount = 'anti_zx10020'
      const sourceAccountID = '1065627301189169152'
      const destinationAccountID = '1071447161949339649'
      const amount: string = new BigNumber(0.01).toString()
      const hubURL = this.registry.hubURL()

      const sourceAccountExistsResponse = await axios.get(`${hubURL}/account/exist/${sourceAccount}`)
      const destinationAccountExistsResponse = await axios.get(`${hubURL}/account/exist/${destinationAccount}`)

      if (sourceAccountExistsResponse.status !== 200) {
        this.log.error(`Source account ${sourceAccount} does not exists in Hub`)
      }

      if (destinationAccountExistsResponse.status !== 200) {
        this.log.error(`Destination account ${destinationAccount} does not exists in Hub`)
      }

      try {
        const connection = await DBManager.instance().dbConnection()
        const botRecord = new BotRecord(tweetId, sourceAccount, destinationAccount, sourceAccountID, destinationAccountID, amount, 'pending')

        const orders = await connection.getRepository(BotRecord).createQueryBuilder('bot_record')
          .where('bot_record.tweetId = :tweetId', {tweetId: botRecord.tweetId}).getMany()
        if (orders.length !== 0) {
          this.log.error(`Tweet with tweetId ${botRecord.tweetId} already processed`)
        } else {
          await connection.createQueryBuilder()
            .insert()
            .into(BotRecord)
            .values([botRecord.toJSON()])
            .execute()
          this.log.info(`Successfully save botRecord: ${JSON.stringify(botRecord.toJSON())}`)
          await axios.post(hubURL + '/payment/new', {
            sourceAccount: sourceAccount,
            destinationAccount: destinationAccount,
            amount: amount
          })
          this.log.info('twitterStream: tweet received', JSON.stringify(tweet))
        }
      } catch  (e) {
        this.log.error(e)
      }
    })

    twitterStream.on('error', (err: Error) => {
      this.log.error('twitterStream:  failed', err)
    })

    const botNameToTrack = this.registry.botNameToTrack()
    twitterStream.track(botNameToTrack)

    const ee = new EventEmitter()

    ee.on('statusUpdated', async (requestID: string, newStatus: string) => {
      if (newStatus === 'paid') {
        const connection = await DBManager.instance().dbConnection()
        await connection.createQueryBuilder()
          .update(BotRecord)
          .set({ status: newStatus })
          .where("id = :id", { id: requestID })
      }
      const connection = await DBManager.instance().dbConnection()

      const payment = await connection.getRepository<BotRecord>(BotRecord).createQueryBuilder('bot_record')
        .where('bot_record.id = :id', { id: requestID }).getOne()

      if (payment) {
        this.twitterPostDirect(payment.sourceAccountID, `Successfully send ${payment.amount}ETH to @${payment.destinationAccount}. Your balance now is `)
        this.twitterPostDirect(payment.destinationAccountID, `User @${payment.sourceAccount} sent you ${payment.amount}ETH. Your balance now is  `)
      }
    })

    // twit.post('statuses/update', { status: 'Take off!' }, (err, data, response) => {
    //   console.log(data)
    // })
    // const twit = this.registry.twit()
    // twit.post( "direct_messages/events/new", {
    //   "event":
    //     {
    //       "type":
    //         "message_create",
    //         "message_create":
    //         {
    //           "target":
    //             {
    //               "recipient_id": "1071447161949339649"
    //             },
    //           "message_data":
    //             {
    //               "text": "Hello World!"
    //             }
    //         }
    //     }
    // } as any, (err: any, data: any, response: any) => {
    //   console.log('\n\n' + JSON.stringify(response))
    //   console.log('\n\n' + JSON.stringify(data))
    // })
  }

  twitterPostDirect (id_str: string, text2msg: string) {
    const twit = this.registry.twit()

    twit.post( "direct_messages/events/new", {
      event:
      {
        type: "message_create",
        message_create:
        {
          target:
          {
            recipient_id: id_str
          },
          message_data:
          {
            text: text2msg
          }
        }
      }
    } as any, (err: any, data: any, response: any) => {
      console.log('\n\n' + JSON.stringify(response))
      console.log('\n\n' + JSON.stringify(data))
    })
  }

}
