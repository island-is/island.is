import request, { CallbackHandler } from 'supertest'

export const getRequestMethod = (
  server: request.SuperTest<request.Test>,
  method: string,
): ((url: string, callback?: CallbackHandler | undefined) => request.Test) => {
  switch (method) {
    case 'GET':
      return server.get
    case 'POST':
      return server.post
    case 'PUT':
      return server.put
    case 'DELETE':
      return server.delete
    default:
      throw new Error('Unsupported HTTP method')
  }
}

/**
 * Helper to match complete object when the received object has gone over the "wire"
 * and was JSON stringified.
 * @param received The SUT object recevied
 * @param expected The expected object to be matched against the received object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectMathcingObject = (received: any, expected: any) => {
  expect(received).toMatchObject(JSON.parse(JSON.stringify(expected)))
}
