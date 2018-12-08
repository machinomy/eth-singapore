import Logger from '@machinomy/logger'
import Options from './config/Options'
import { memoize } from 'decko'
import { HttpEndpoint } from './endpoints/http/HttpEndpoint'
import { HttpsEndpoint } from './endpoints/https/HttpsEndpoint'

export class Registry {
  options: Options
  log: Logger

  constructor (options: Options) {
    this.options = options
    this.log = new Logger('registry')
  }

  @memoize
  async httpEndpoint (): Promise<HttpEndpoint> {
    const port = this.options.optionB
    return new HttpEndpoint(port)
  }

  @memoize
  async httpsEndpoint (): Promise<HttpsEndpoint> {
    const port = this.options.optionB
    const keyPath = this.options.sslKeyPath
    const certPath = this.options.sslCertPath
    return new HttpsEndpoint(port, keyPath, certPath)
  }

  @memoize
  methodA (): string {
    return 'I am methodA'
  }
}
