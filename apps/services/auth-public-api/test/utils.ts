import { DelegationDTO } from '@island.is/auth-api-lib'
import request, { CallbackHandler } from 'supertest'

export const getRequestMethod = (
  server: request.SuperTest<request.Test>,
  method: string,
): ((url: string, callback?: CallbackHandler | undefined) => request.Test) => {
  switch (method) {
    case 'POST':
      return server.post
    case 'PUT':
      return server.put
    case 'DELETE':
      return server.delete
    default:
      // GET
      return server.get
  }
}

/**
 * Helper to match complete object when the received object has gone over the "wire"
 * and was JSON stringified.
 * @param received The SUT object recevied
 * @param expected The expected object to be matched against the received object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectMatchingObject = (received: any, expected: any) => {
  expect(received).toMatchObject(JSON.parse(JSON.stringify(expected)))
}

/**
 * Sorts the delegation by id parameter to use for consistent expecting
 * @param delegations
 */
export const sortDelegations = (delegations: DelegationDTO[]) => {
  delegations.sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return a.id === b.id ? 0 : a.id! < b.id! ? -1 : 1
  })
}
