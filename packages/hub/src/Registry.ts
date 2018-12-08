import Logger from '@machinomy/logger'
import Options from './config/Options'
import { memoize } from 'decko'
import { HttpEndpoint } from './endpoints/http/HttpEndpoint'
import { HttpsEndpoint } from './endpoints/https/HttpsEndpoint'
import * as Web3 from 'web3'
import { Record } from './entity/Record'
import { createConnection, Connection } from 'typeorm'
import HDWalletProvider from '@machinomy/hdwallet-provider'

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
  async dbConnection () {
    return await createConnection({
      type: 'sqlite',
      synchronize: true,
      database: 'db.sqlite3',
      entities: [ Record ]
    })
  }

  @memoize
  web3 (): Web3 {
    const network = this.options.networkURL
    // const provider = HDWalletProvider.http(MNEMONIC, this.options.networkURL)
    return new Web3(new Web3.providers.HttpProvider(network))
  }

  @memoize
  methodA (): string {
    return 'I am methodA'
  }
}
