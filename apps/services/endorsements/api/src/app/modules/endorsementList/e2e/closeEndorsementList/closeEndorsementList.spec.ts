import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { setup } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
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

describe('closeEndorsementList', () => {
  it(`PUT /endorsement-list/:listId/close should return 404 when closing an non existing list`, async () => {
    const response = await request(app.getHttpServer())
      .put('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/close')
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`PUT /endorsement-list/:listId/close should not be able to close endorsement lists for others`, async () => {
    const response = await request(app.getHttpServer())
      .put('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba013/close')
      .send()
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  it(`PUT /endorsement-list/:listId/close should close existing endorsement list`, async () => {
    const response = await request(app.getHttpServer())
      .put('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba012/close')
      .send()
      .expect(200)

    expect(response.body).toMatchObject({ closedDate: expect.any(String) })
  })
})
