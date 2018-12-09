import Logger from '@machinomy/logger'
import * as jsonRPCws from 'json-rpc-ws'
import { SampleHandler } from './handlers'

export class WebSocketJSONRPCEndpoint {
  wsServer: jsonRPCws.Server<jsonRPCws.Connection>
  wsHost: string
  wsPort: number
  log: Logger
  isInit: boolean

  constructor (wsHost: string, wsPort: number) {
    this.log = new Logger('webSocketJSONRPCEndpoint')
    this.wsServer = jsonRPCws.createServer()
    this.wsHost = wsHost
    if (wsPort < 1024 || wsPort > 65535) {
      throw RangeError('wsPort must be in range [1024;65535]')
    }
    this.wsPort = wsPort
    this.isInit = false
  }

  async listen (): Promise<void> {
    if (!this.isInit) {
      await this.init()
    }

    return this.wsServer.start({ host: this.wsHost, port: this.wsPort }, () => {
      this.log.info(`WS Server listening on ws://${this.wsHost}:${this.wsPort}`)
    })
  }

  private async init (): Promise<void> {
    this.wsServer.expose(SampleHandler.endpoint(), SampleHandler.handler)
    this.isInit = true
  }
}
