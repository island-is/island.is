import { GenericScope } from '@island.is/auth/scopes'
import request from 'supertest'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { authNationalId } from './seed'

describe('deleteEndorsement', () => {
  it(`DELETE /endorsement-list/:listId/endorsement should fail and return 403 error if scope is missing`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })
    const response = await request(app.getHttpServer())
      .delete(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c7/endorsement',
      )
      .send()
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it(`DELETE /endorsement-list/:listId/endorsement should return 404 when supplied with a non existing list`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })
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
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })
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
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })
    const response = await request(app.getHttpServer())
      .delete(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c7/endorsement',
      )
      .send()
      .expect(204)

    expect(response.body).toBeTruthy()
  })
})
