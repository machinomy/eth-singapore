import * as Router from 'koa-router'

export async function getRequestHandler (ctx: Router.IRouterContext) {
  // const requestId = ctx.params['requestId']

  // Do what you want here

  ctx.status = 200
  ctx.response.body = {
    status: 'well_done'
  }
}
