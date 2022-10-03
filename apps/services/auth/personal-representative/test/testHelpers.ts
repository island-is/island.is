import request, { CallbackHandler } from 'supertest'

export const errorExpectedStructure = {
  error: expect.any(String),
  message: expect.anyOf([String, Array]),
  statusCode: expect.any(Number),
}

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
  }
  throw new Error('Unsupported HTTP method')
}
