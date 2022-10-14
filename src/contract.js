const functions = { register, evolve }

const VOUCHDAO = 'ZGaL5DOMIYRw9YHZ_NZ2JoIjST1QwhiD6T1jePH381I'

export async function handle(state, action) {
  if (Object.keys(functions).includes(action.input.function)) {
    return functions[action.input.function](state, action)
  }
  throw new ContractError(`${action.input.function} function not implemented!`)
}

async function register(state, { input, caller }) {
  const { address, transaction, timestamp } = input
  ContractAssert(address.length === 43, 'Address is not valid!')
  ContractAssert(transaction.length === 43, 'Transaction is not valid!')
  ContractAssert(Number.isInteger(timestamp), 'Timestamp is required!')
  // verify caller is from an approved vouchDao service
  if (await verified(caller)) {
    state.registry[address + ':' + caller] = {
      transaction,
      address,
      service: caller,
      timestamp
    }
  }
  return { state }

}

function evolve(state, action) {
  if (state.canEvolve) {
    if (state.creator === action.caller) {
      state.evolve = action.input.value
    }
  }
  return { state }
}


async function verified(service) {
  const res = await SmartWeave.contracts.readContractState(VOUCHDAO);
  return res.votes
    .filter(vote => vote.status === 'passed')
    .reduce((a, { value }) => ({ ...a, [value]: true }), {})[service] || false;

}