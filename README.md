# Vouch Registry Contract

The purpose of this contract is to create a registry of Vouched Users that can be access by contracts that want to restrict function invocation only by vouched users. This contract simply maintains a registry object, that only can be registered and unregistered by approved VouchDAO servers. 

## Registry Contract

`3dn4-tmgvlBxmqvLY42tfdMf_uMPjLQylC4xzAcP2FI`

The VouchService Registration process should be done in the following steps:

Once a Arweave Wallet user has been approved, the service should create a `Vouch For` Transaction based on the ANS 109 specification. Then the service should write an interaction to the Vouch Registry Contract.

### Step 1

```js
const tx = await arweave.createTransaction({data: address })
tx.addTag('App-Name', 'Vouch')
tx.addTag('Vouch-For', address)
tx.addTag('App-Version', '0.1')
tx.addTag('Verification-Method', 'Twitter')
tx.addTag('User-Identifier', 'optional@mail.com')

await arweave.transactions.sign(tx, wallet)
const vouchForTxId = tx.id
await arweave.transactions.post(tx)
```

### Step 2

```js
await warp.connect(wallet).writeInteraction({
  function: 'register',
  address: address,
  timestamp: Date.now(),
  transaction: vouchForTxId
})
```


