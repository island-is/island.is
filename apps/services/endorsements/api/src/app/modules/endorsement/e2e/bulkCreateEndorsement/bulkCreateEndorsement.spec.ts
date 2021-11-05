import request from 'supertest'
import { EndorsementsScope } from '@island.is/auth/scopes'
import { authNationalId } from './seed'
import { getAuthenticatedApp, setup } from '../../../../../../test/setup'
import {
  errorExpectedStructure,
  metaDataResponse,
} from '../../../../../../test/testHelpers'
import { INestApplication } from '@nestjs/common'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'

// let app: INestApplication

// beforeAll(async () => {
//   app = await setup({
//     override: (builder) =>
//       builder.overrideGuard(IdsUserGuard).useValue(
//         new MockAuthGuard({
//           nationalId: '1234567890',
//           scope: [EndorsementsScope.main],
//         }),
//       ),
//   })
// })

describe('bulkCreateEndorsement', () => {
  it(`POST /endorsement-list/:listId/endorsement/bulk should fail and return 403 error if scope is missing`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalIds = ['0101304339', '0101304339']
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c1/endorsement/bulk`,
      )
      .send({ nationalIds })
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })

  it(`POST /endorsement-list/:listId/endorsement/bulk should partially succeed when list contains some existing national ids`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalIds = ['0101304339', '0101304339']
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c1/endorsement/bulk`,
      )
      .send({ nationalIds })
      .expect(201)

    // should return the created endorsements and error objects
    expect(response.body.succeeded).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          // lets make sure metadata got correctly populated
          meta: {
            ...metaDataResponse,
            bulkEndorsement: true,
          },
        }),
      ]),
    )
  })
  it(`POST /endorsement-list/:listId/endorsement/bulk should fail to create endorsements on a closed list`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalIds = ['0101304339']
    const response = await request(app.getHttpServer())
      .post(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c2/endorsement/bulk',
      )
      .send({ nationalIds })
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  it(`POST /endorsement-list/:listId/endorsement/bulk should fail to create endorsements on other peoples lists`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalIds = ['0101304339']
    const response = await request(app.getHttpServer())
      .post(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c3/endorsement/bulk',
      )
      .send({ nationalIds })
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  it(`POST /endorsement-list/:listId/endorsement/bulk should create new endorsements and populate metadata`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const listId = '9c0b4106-4213-43be-a6b2-ff324f4ba0c1'
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalIds = ['0101303369', '0101305069', '0101303019']
    const response = await request(app.getHttpServer())
      .post(`/endorsement-list/${listId}/endorsement/bulk`)
      .send({ nationalIds })
      .expect(201)

    // should return the created endorsements
    expect(response.body.succeeded).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          endorsementListId: listId,
          // lets make sure metadata got correctly populated
          meta: {
            ...metaDataResponse,
            bulkEndorsement: true,
          },
        }),
      ]),
    )
  })
})
