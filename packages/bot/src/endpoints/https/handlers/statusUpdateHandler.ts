import * as Router from 'koa-router'
import EventEmitter = NodeJS.EventEmitter

export async function statusUpdateHandler (ctx: Router.IRouterContext) {
  const body = ctx.request.body as any
  const requestID = body['requestID']
  const newStatus = body['status']
  const ee = new EventEmitter()
  ee.emit('statusUpdated', requestID, newStatus)

  ctx.status = 200
}
