import * as Router from 'koa-router'
import { Record } from '../../../entity/Record'
import * as solUtils from '../../../util/SolidityUtils'
import { DBManager } from '../../../DBManager'
import Logger from '@machinomy/logger'

const log = new Logger('recordAddHandler')

export async function recordAddHandler (ctx: Router.IRouterContext) {
  const body = ctx.request.body as any
  const account = body['account']
  const address = body['address']
  const signature = body['signature']
  const recoveredAddress = solUtils.recover(signature, solUtils.keccak256FromStrings(account, address))
  let record = {} as Record

  try {
    if (recoveredAddress !== address) {
      const connection = await DBManager.instance().dbConnection()
      record = new Record(account, address, signature)

      await connection.createQueryBuilder()
        .insert()
        .into(Record)
        .values([ record.toJSON() ])
        .execute()
      log.info(`Successfully save record: ${JSON.stringify(record.toJSON())}`)
      ctx.status = 200
    } else {
      log.error(`Recovered address doesnot match initial address. Check addresses or signature.`)
      ctx.status = 400
    }
  } catch (e) {
    log.error(`Error while saving record ${JSON.stringify(record.toJSON())}`)
    log.error(e)
    ctx.status = 400
  }
}
