import * as fs from 'fs-extra'
import * as path from 'path'
import MainContract from './wrappers/Main'
import HDWalletProvider from '@machinomy/hdwallet-provider'
import Logger from '@machinomy/logger'

const LOG = new Logger('deploy-main-contract')

const KEY = 'peanut giggle name tree canoe tube render ketchup survey segment army will'

async function run () {
  const ETH_RPC_URL = 'https://rinkeby.infura.io'

  LOG.info(`ETH_RPC_URL = ${ETH_RPC_URL}`)

  const provider = HDWalletProvider.http(KEY, ETH_RPC_URL)

  LOG.info(`Wait for 30-60 seconds, please.`)

  const mainContract = MainContract.contract(provider)
  const instanceMainContract = await mainContract.new({ from: await provider.getAddress(0) })

  const address = instanceMainContract.address
  const transactionHash = (instanceMainContract as any).transactionHash

  LOG.info(`Address = ${address}`)
  LOG.info(`TransactionHash = ${transactionHash}`)

  const newItemJSON = {
    events: {},
    links: {},
    address: address,
    transactionHash: transactionHash
  }

  const ARTIFACT_PATH = path.resolve(__dirname, '../build/contracts/Main.json')
  const mainContractJSON = require(ARTIFACT_PATH)
  mainContractJSON['networks']['4'] = newItemJSON

  fs.writeFileSync(ARTIFACT_PATH, JSON.stringify(mainContractJSON, null, 2))

  LOG.info('Main contract has been successfully deployed.')

  process.exit(0)
}

run().then(() => {
  // Do Nothing
}).catch(error => {
  console.error(error)
  process.exit(1)
})
