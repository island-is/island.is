import { EndorsementsScope } from '@island.is/auth/scopes'
import request from 'supertest'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { authNationalId } from './seed'

describe('closeEndorsementList', () => {
  it(`PUT /endorsement-list/:listId/close should fail and return 403 error if scope is missing`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })
    const response = await request(app.getHttpServer())
      .put('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba012/close')
      .send()
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it(`PUT /endorsement-list/:listId/close should return 404 when closing an non existing list`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
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
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .put('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba013/close')
      .send()
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
})
