// unit test to test the register function
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { handle } from '../src/contract.js'

globalThis.ContractAssert = (exp, text) => exp === true
globalThis.SmartWeave = {
  contracts: {
    readContractState: (contract) => {
      return Promise.resolve(vouchDAOState())
    }
  }
}

test('register', async () => {
  const state = {
    name: 'vouch registry',
    registry: {},
    canEvolve: true,
    creator: '1234'
  }
  const action = {
    caller: 'Ax_uXyLQBPZSQ15movzv9-O1mDo30khslqN64qD27Z8',
    input: {
      function: 'register',
      transaction: '77777',
      timestamp: Date.now(),
      address: '99999'
    }
  }
  const result = await handle(state, action)

  assert.equal(result.state.registry['99999:Ax_uXyLQBPZSQ15movzv9-O1mDo30khslqN64qD27Z8'].transaction, '77777')

})

test.run()



function vouchDAOState() {
  return {
    "name": "VouchDAO",
    "roles": {},
    "vault": {
      "UZ1YsJa8yJrw8yynYzhaAikqD1uuMu9gi9u7Ia_Eja8": [
        {
          "balance": 10000000,
          "end": 992169,
          "start": 991449
        }
      ]
    },
    "votes": [
      {
        "status": "passed",
        "type": "set",
        "note": "Verifying Tom's twitter verification address",
        "yays": 7200000000,
        "nays": 0,
        "voted": [
          "UZ1YsJa8yJrw8yynYzhaAikqD1uuMu9gi9u7Ia_Eja8"
        ],
        "start": 991453,
        "totalWeight": 7200000000,
        "key": "Voucher",
        "value": "Ax_uXyLQBPZSQ15movzv9-O1mDo30khslqN64qD27Z8"
      }
    ],
    "ticker": "VOUCH",
    "balances": {
      "UZ1YsJa8yJrw8yynYzhaAikqD1uuMu9gi9u7Ia_Eja8": 0
    },
    "settings": [
      [
        "quorum",
        0.5
      ],
      [
        "support",
        0.5
      ],
      [
        "voteLength",
        2000
      ],
      [
        "lockMinLength",
        720
      ],
      [
        "lockMaxLength",
        720
      ],
      [
        "communityLogo",
        "uFV_tr2eAhwrK9FryP-NtFTw3N-WshC0iIMP7MvIVHY"
      ],
      [
        "communityDescription",
        "VouchDAO allows users to verify once and be trusted everywhere on the Permaweb."
      ],
      [
        "communityAppUrl",
        "https://www.twitter.com/vouchdao"
      ],
      [
        "Voucher",
        "Ax_uXyLQBPZSQ15movzv9-O1mDo30khslqN64qD27Z8"
      ]
    ]
  }
}