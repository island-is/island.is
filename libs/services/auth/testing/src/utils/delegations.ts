import { DelegationDTO } from '@island.is/auth-api-lib'

const compareById = (a: { id?: string | null }, b: { id?: string | null }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return a.id === b.id ? 0 : a.id! < b.id! ? -1 : 1
}

/**
 * Sorts the delegation by id parameter to use for consistent expecting
 * @param delegations
 */
const sortDelegations = (delegations: DelegationDTO[]) => {
  delegations.forEach((delegation) => delegation.scopes?.sort(compareById))
  delegations.sort(compareById)
}

/**
 * Helper to match complete object when the received object has gone over the "wire"
 * and was JSON stringified.
 * @param received The SUT object recevied
 * @param expected The expected object to be matched against the received object
 */
export const expectMatchingDelegations = (
  received: DelegationDTO | DelegationDTO[],
  expected: DelegationDTO | DelegationDTO[],
) => {
  if (Array.isArray(received)) {
    sortDelegations(received)
  }
  if (Array.isArray(expected)) {
    sortDelegations(expected)
  }

  expect(received).toMatchObject(JSON.parse(JSON.stringify(expected)))
}
