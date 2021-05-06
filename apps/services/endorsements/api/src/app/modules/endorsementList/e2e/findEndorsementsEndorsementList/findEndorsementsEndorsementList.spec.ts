import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { setup } from '../../../../../../test/setup'
import { authNationalId } from './seed'
let app: INestApplication

beforeAll(async () => {
  app = await setup({
    override: (builder) => {
      builder
        .overrideProvider(IdsUserGuard)
        .useValue(new MockAuthGuard({ nationalId: authNationalId }))
        .compile()
    },
  })
})

describe('findEndorsementsEndorsementList', () => {
  it(`GET /endorsement-list/endorsements should return 200 and a list of endorsements`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list/endorsements')
      .send()
      .expect(200)

    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body).toHaveLength(2)
  })
})
