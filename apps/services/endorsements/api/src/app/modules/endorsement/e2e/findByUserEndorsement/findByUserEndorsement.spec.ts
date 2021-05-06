import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { setup } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { Endorsement } from '../../endorsement.model'
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

describe('findByUserEndorsement', () => {
  it(`GET /endorsement-list/:listId/endorsement/exists should return 404 and error if list does not exist`, async () => {
    const response = await request(app.getHttpServer())
      .get(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/endorsement/exists',
      )
      .send()
      .expect(404)

    await expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`GET /endorsement-list/:listId/endorsement/exists should return 404 if no endorsement exists on list`, async () => {
    const response = await request(app.getHttpServer())
      .get(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba010/endorsement/exists',
      )
      .send()
      .expect(404)

    await expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`GET /endorsement-list/:listId/endorsement/exists should return 200 and a valid endorsement`, async () => {
    const response = await request(app.getHttpServer())
      .get(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c9/endorsement/exists',
      )
      .send()
      .expect(200)

    const endorsement = new Endorsement(response.body) // we know we have at least one endorsement
    await expect(endorsement.validate()).resolves.not.toThrow()
  })
})
