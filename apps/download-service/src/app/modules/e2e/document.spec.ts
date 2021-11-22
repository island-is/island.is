import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { setup } from '../../../../test/setup'

let app: INestApplication
let server: request.SuperTest<request.Test>

beforeAll(async () => {
  app = await setup()
  server = request(app.getHttpServer())
})

describe('Download Service', () => {
  let spy: jest.SpyInstance<
    string | undefined,
    [import('@nestjs/common').ExecutionContext]
  >
  beforeEach(() => {
    spy = jest.fn()
  })
  afterAll(() => {
    spy.mockRestore()
  })

  it('should fail when trying to POST when not logged in', async () => {
    const invalidToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc2xhbmQuaXMiLCJpYXQiOjE2MTY4NjQ0MTQsImV4cCI6MTY0ODQwMDQxNCwiYXVkIjoiaXNsYW5kLmlzIiwic3ViIjoiZG9lc25vdHdvcmtAaXNsYW5kLmlzIn0.8FKiBz0wj9bfEZ1JpHKHZxlIJ8huBfXgegXolcWT21s'
    const failedResponse = await server
      .post('/electronic-documents/12312312312')
      .send({
        token: invalidToken,
      })
      .expect(401)

    expect(failedResponse.body.message).toBe('Unauthorized')
  })
})
