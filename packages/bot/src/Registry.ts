import Logger from '@machinomy/logger'
import Options from './config/Options'
import { memoize } from 'decko'
import { HttpEndpoint } from './endpoints/http/HttpEndpoint'
import { HttpsEndpoint } from './endpoints/https/HttpsEndpoint'
import * as Twit from 'twit'

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
  twitterStream () {
    const consumer_key = this.options.twitterConsumerKey
    const consumer_secret = this.options.twitterConsumerSecret
    const token = this.options.twitterAccessToken
    const token_secret = this.options.twitterAccessTokenSecret

    const NodeTwitterStream = require('node-tweet-stream')
    const result = new NodeTwitterStream({
      consumer_key: consumer_key,
      consumer_secret: consumer_secret,
      token: token,
      token_secret: token_secret
    })

    return result
  }

  @memoize
  twit() {
    const consumer_key = this.options.twitterConsumerKey
    const consumer_secret = this.options.twitterConsumerSecret
    const token = this.options.twitterAccessToken
    const token_secret = this.options.twitterAccessTokenSecret

    const result = new Twit({
      consumer_key: consumer_key,
      consumer_secret: consumer_secret,
      access_token: token,
      access_token_secret: token_secret,
      timeout_ms: 60*1000,
      strictSSL: true
    })

    return result
  }

  @memoize
  botNameToTrack (): string {
    return this.options.botNameToTrack
  }

  @memoize
  hubURL (): string {
    return this.options.hubURL
  }
}
