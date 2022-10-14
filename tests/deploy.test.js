import { test } from 'uvu'
import * as assert from 'uvu/assert'
import fs from 'fs'
import { assoc } from 'ramda'
import { WarpFactory, LoggerFactory } from 'warp-contracts/mjs'
import ArLocal from 'arlocal'
import Arweave from 'arweave'


LoggerFactory.INST.logLevel('fatal')
const warp = WarpFactory.forLocal()

test('deploy contract', async () => {
  const { arlocal, wallet, contractTxId } = await setup()
  assert.equal(contractTxId.length, 43)
  const result = await warp.contract(contractTxId).connect(wallet.jwk).readState()
  assert.equal(result.cachedValue.state.name, 'vouch registry')
  await teardown(arlocal)

})

test.run()

async function setup() {
  const arweave = Arweave.init({ host: 'localhost', port: 1984, protocol: 'http' })
  // start arlocal
  const arlocal = new ArLocal.default(1984, false)
  await arlocal.start()
  // generate wallet
  let wallet = { jwk: await arweave.wallets.generate() }
  wallet = assoc('addr', await arweave.wallets.jwkToAddress(wallet.jwk), wallet)
  await arweave.api.get(`mint/${wallet.addr}/${arweave.ar.arToWinston('10000')}`)
  await arweave.api.get('mine')
  // deploy contract
  const src = fs.readFileSync('./src/contract.js', 'utf-8')
  const { contractTxId } = await warp.createContract.deploy({
    wallet: wallet.jwk,
    src,
    initState: JSON.stringify({
      name: 'vouch registry',
      registry: {},
      canEvolve: true,
      creator: wallet.addr
    })
  })

  await arweave.api.get('mine')

  return { arlocal, wallet, contractTxId }
}

async function teardown(arlocal) {
  await arlocal.stop()
}