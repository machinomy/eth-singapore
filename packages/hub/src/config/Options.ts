import * as yargs from 'yargs'
import * as path from 'path'

interface Options {
  optionA: string
  optionB: number
  optionC: BigInt
  sslKeyPath: string
  sslCertPath: string
}

// TODO Insert it into class
const parser = yargs
    .config()
    .alias('c', 'config')
    .demandOption('config')

namespace Options {
  async function parse (args: Array<string>): Promise<any> {
    const options = parser.parse(args)
    return options
  }

  export async function build (args: Array<string>): Promise<Options> {
    const options = await parse(args)
    const resolvedSSLKeyPath = path.resolve(options.sslKeyPath)
    const resolvedSSLCertPath = path.resolve(options.sslCertPath)
    return {
      optionA: options.optionA,
      optionB: options.optionB,
      optionC: options.optionC,
      sslKeyPath: resolvedSSLKeyPath,
      sslCertPath: resolvedSSLCertPath
    }
  }
}

export default Options
