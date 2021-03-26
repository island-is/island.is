import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { IdsAuthGuard } from '@island.is/auth-nest-tools'
import { setup } from '../../../../test/setup'

let app: INestApplication


const nationalId = '1234564321'
let server: request.SuperTest<request.Test>

beforeAll(async () => {
  app = await setup({
    override: (builder) => {
      builder
        .overrideGuard(IdsAuthGuard)
        .useValue(() => ({}))
        .compile()
    },
  })

  server = request(app.getHttpServer())
})

describe('Download Service', () => {
  let spy: jest.SpyInstance<
    string | undefined,
    [import('@nestjs/common').ExecutionContext]
  >
  beforeEach(() => {

  })
  afterAll(() => {

  })

  it('emtpy test', async () => {

    expect(true).toBe(true)
  })

})
