import axios from 'axios'
import * as Router from 'koa-router'
import { ChainManager } from '../../../ChainManager'
import { DBManager } from '../../../DBManager'
import { Record } from '../../../entity/Record'

export async function paymentNewHandler (ctx: Router.IRouterContext) {
  const body = ctx.request.body as any

  const operationId = body['id']
  const fromAccount = body['sourceAccount']
  const toAccount = body['destinationAccount']
  const amount = body['amount']

  const connection = await DBManager.instance().dbConnection()
  const sourceAccount = await connection.getRepository<Record>(Record).createQueryBuilder('record')
    .where('record.account = :account', { account: fromAccount }).getOne()
  const destinationAccount = await connection.getRepository<Record>(Record).createQueryBuilder('record')
    .where('record.account = :account', { account: toAccount }).getOne()


  // const recoveredAddress = solUtils.recover(signature, solUtils.keccak256FromStrings(account, address))
  try {
    ChainManager.instance().transfer(operationId, fromAccount, sourceAccount!.address, destinationAccount!.address, amount, sourceAccount!.signature)
      .then(async (tx: any) => {
        await axios.post('http://localhost:2045' + '/payment/new', {
          requestID: operationId,
          status: 'paid'
        })
      })
  } catch (e) {
    console.error(e)
  }

  // Always 200, later we will send post request status/update to bot
  ctx.status = 200
}
