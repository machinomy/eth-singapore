import * as Router from 'koa-router'
import * as solUtils from '../../../util/SolidityUtils'

export async function recordAddHandler (ctx: Router.IRouterContext) {
  const body = ctx.request.body as any
  const account = body['account']
  const address = body['address']
  const signature = body['signature']

  const recoveredAddress = solUtils.recover(signature, solUtils.keccak256FromStrings(account, address))

  if (recoveredAddress !== address) {
    ctx.status = 400
  } else {
    ctx.status = 200
  }
}
