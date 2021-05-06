import { setup } from '../../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Endorsement } from '../../endorsement.model'
import { errorExpectedStructure } from '../../../../utils/testHelpers'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
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

describe('findAllEndorsement', () => {
  it(`GET /endorsement-list/:listId/endorsement should return 404 and error if list does not exist`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/endorsement')
      .send()
      .expect(404)

    await expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`GET /endorsement-list/:listId/endorsement should return 200 and a list of endorsements`, async () => {
    const response: { body: Endorsement[] } = await request(app.getHttpServer())
      .get('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c8/endorsement')
      .send()
      .expect(200)

    for (const endorsementResponse of response.body) {
      const endorsement = new Endorsement(endorsementResponse) // we know we have at least one endorsement
      await expect(endorsement.validate()).resolves.not.toThrow()
    }

    expect(response.body).toHaveLength(2)
  })
})
