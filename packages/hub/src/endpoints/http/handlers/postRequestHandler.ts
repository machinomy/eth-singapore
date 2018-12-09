import * as Router from 'koa-router'

export async function postRequestHandler (ctx: Router.IRouterContext) {
  const body = ctx.request.body as any

  // Do what you want here

  ctx.status = 200
}
