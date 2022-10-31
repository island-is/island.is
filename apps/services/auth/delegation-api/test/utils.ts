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
