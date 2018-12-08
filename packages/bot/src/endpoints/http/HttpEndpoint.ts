import * as Koa from 'koa'
import * as http from 'http'
import * as bodyParser from 'koa-bodyparser'
import * as session from 'koa-session'
import * as Router from 'koa-router'
import Logger from '@machinomy/logger'
import { getRequestHandler, postRequestHandler } from './handlers'

export class HttpEndpoint {
  private readonly app: Koa
  private readonly port: number
  private readonly log: Logger

  private server: http.Server | undefined
  private readonly router: Router

  constructor (port: number) {
    this.log = new Logger('httpEndpoint')
    this.app = new Koa()
    this.app.use(session({
      maxAge: 86400000
    }, this.app))
    this.app.use(bodyParser())
    this.router = new Router()
    this.routesSetup()

    this.app.use(this.router.routes()).use(this.router.allowedMethods())
    this.port = port

    this.server = http.createServer(this.app.callback())
  }

  routesSetup () {
    this.router.post('/postRequest', postRequestHandler)
    this.router.get('/getRequest/:requestId', getRequestHandler)
  }

  async listen (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const server = this.app.listen(this.port, () => {
        this.server = server
        this.log.info(`HttpEndpoint listen on port ${this.port}`)
        resolve()
      })
      this.app.onerror = (error: Error) => {
        reject(error)
      }
    })
  }

  async close (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.server) {
        this.server.close((error: any) => {
          if (error) {
            reject(error)
          } else {
            this.server = undefined
            resolve()
          }
        })
      } else {
        reject(new Error('HttpEndpoint is not running'))
      }
    })
  }
}
