import { BigNumber } from 'bignumber.js'
import { memoize } from 'decko'
import * as Web3 from 'web3'
import MainContract from './wrappers/Main'

export class ChainManager {
  private static i: ChainManager

  private constructor() {}

  static instance() {
    if (!ChainManager.i) {
      ChainManager.i = new ChainManager()
    }
    return ChainManager.i
  }

  @memoize
  async mainContract (): Promise<MainContract.Contract> {
    const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/'))
    const result = await MainContract.contract(web3.currentProvider).deployed()
    return result
  }

  async address () {
    const contract = await this.mainContract()
    console.log(`contract.address = ${contract.address}`)
  }

  async transfer (operationId: number, fromAccount: string, fromAddress: string, toAddress: string, amount: BigNumber, fromSignature: string): Promise<void> {
    const contract = await this.mainContract()
    const tx = await contract.transfer(operationId, fromAccount, fromAddress, toAddress, amount, fromSignature)
    const eventArgs: MainContract.transferSuccessful = tx.logs[0].args
  }
}
