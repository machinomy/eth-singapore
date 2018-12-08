import Logger from '@machinomy/logger'
import * as Router from 'koa-router'
import { DBManager } from '../../../DBManager'
import { Record } from '../../../entity/Record'

const log = new Logger('accountExistHandler')

export async function accountExistHandler (ctx: Router.IRouterContext) {
  const params = ctx.params as any
  const account = params.account

  try {
    const connection = await DBManager.instance().dbConnection()

    const orders = await connection.getRepository(Record).createQueryBuilder('record')
      .where('record.account = :account', { account: account }).getMany()
    if (orders.length !== 0) {
      log.error(`Account ${account} has no connected eth address`)
      ctx.status = 400
    } else {
      log.info(`Account ${account} has connected eth address`)
      ctx.status = 200
    }
  } catch  (e) {
    log.error(e)
    ctx.status = 400
  }
}
