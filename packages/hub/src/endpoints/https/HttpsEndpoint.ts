import * as fs from 'fs'
import * as Koa from 'koa'
import * as https from 'https'
import * as bodyParser from 'koa-bodyparser'
import * as session from 'koa-session'
import * as Router from 'koa-router'
import Logger from '@machinomy/logger'
import { getRequestHandler, recordAddHandler } from './handlers'

export class HttpsEndpoint {
  private readonly app: Koa
  private readonly port: number
  private readonly log: Logger

  private server: https.Server
  private readonly router: Router

  constructor (port: number, sslKeyPath: string, sslCertPath: string) {
    this.log = new Logger('httpsEndpoint')
    this.app = new Koa()
    this.app.use(session({
      maxAge: 86400000
    }, this.app))
    this.app.use(bodyParser())
    this.router = new Router()
    this.routesSetup()

    this.app.use(this.router.routes()).use(this.router.allowedMethods())
    this.port = port

    const options = {
      key: fs.readFileSync('../../../support/ssl/privkey.pem', 'utf8'),
      cert: fs.readFileSync('../../../support/ssl/cert.pem', 'utf8')
    }

    this.server = https.createServer(options, this.app.callback())
  }

  routesSetup () {
    this.router.post('/record/add', recordAddHandler)
    this.router.get('/getRequest/:requestId', getRequestHandler)
  }

  async listen (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.server.listen(this.port, () => {
        this.log.info('listen on port %d', this.port)
        resolve()
      })
      this.server.addListener('error', (error: Error) => {
        reject(error)
      })
    })
  }

  async close (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.server.close((error: any) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
