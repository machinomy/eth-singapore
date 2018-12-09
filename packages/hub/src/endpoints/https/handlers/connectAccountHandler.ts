import Logger from '@machinomy/logger'
import * as Router from 'koa-router'
import { DBManager } from '../../../DBManager'
import { Record } from '../../../entity/Record'

const log = new Logger('connectAccountHandler')

export async function connectAccountHandler (ctx: Router.IRouterContext) {
  const body = ctx.request.body as any
  const account = body['account']
  const address = body['address']
  const signature = body['signature']

  const record = new Record(account, address, signature)
  try {
    const connection = await DBManager.instance().dbConnection()

    await connection.createQueryBuilder()
      .insert()
      .into(Record)
      .values([ record.toJSON() ])
      .execute()
    ctx.status = 200
  } catch  (e) {
    log.error(e)
    ctx.status = 400
  }
}
