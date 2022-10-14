import { WarpFactory, LoggerFactory } from 'warp-contracts/mjs'
import Arweave from 'arweave'
import fs from 'fs'

LoggerFactory.INST.logLevel('fatal')
const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' })

const warp = WarpFactory.forMainnet()
const src = fs.readFileSync('./src/contract.js', 'utf-8')
const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))
const addr = arweave.wallets.jwkToAddress(wallet)
const initState = JSON.stringify({
  name: 'VOUCH_REGISTRY',
  registry: {},
  canEvolve: true,
  creator: addr
})

async function main() {
  const result = await warp.createContract.deploy({
    src,
    wallet,
    initState
  })
  console.log(result)
}

main()