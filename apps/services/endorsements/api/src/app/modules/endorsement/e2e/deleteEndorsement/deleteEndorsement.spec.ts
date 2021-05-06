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

describe('deleteEndorsement', () => {
  it(`DELETE /endorsement-list/:listId/endorsement should return 404 when supplied with a non existing list`, async () => {
    const response = await request(app.getHttpServer())
      .delete(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/endorsement',
      )
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`DELETE /endorsement-list/:listId/endorsement should fail when removing endorsement from closed list`, async () => {
    const response = await request(app.getHttpServer())
      .delete(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c6/endorsement',
      )
      .send()
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  it(`DELETE /endorsement-list/:listId/endorsement should remove endorsement`, async () => {
    const response = await request(app.getHttpServer())
      .delete(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c7/endorsement',
      )
      .send()
      .expect(204)

    expect(response.body).toBeTruthy()
  })
})
