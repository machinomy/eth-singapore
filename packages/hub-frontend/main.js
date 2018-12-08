vynos.display()

let connect = function (account, address) {
  if ((account === undefined || account === null) || (address === undefined || account === null)) {
    account = ''
    address = ''
  }
  vynos.ready().then((wallet) => {
    let web3 = new Web3(wallet.provider)
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        if (err.message === 'invalid address') {
          console.error('Please, login into Vynos.')
        }
        console.error(err)
      } else {
        web3.eth.sign(accounts[0], web3.sha3(account+address), (err, res) => {
          if (err) {
            console.error(err)
          }
          if (res) {
            console.log(res)
          }
        })
      }
    })
  })
}

let connectButton = document.getElementById('connect_button')
if (connectButton) {
  connectButton.onclick = function (ev) {
    ev.preventDefault()
    let account = document.getElementById('account')
    let address = document.getElementById('address')
    if (account && address) {
      connect(account.value, address.value.toLowerCase())
    }
  }
}
