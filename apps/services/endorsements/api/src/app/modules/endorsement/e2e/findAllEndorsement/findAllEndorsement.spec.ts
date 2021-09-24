import request from 'supertest'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { Endorsement } from '../../models/endorsement.model'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { authNationalId } from './seed'
import { GenericScope } from '@island.is/auth/scopes'

describe('findAllEndorsement', () => {
  it(`GET /endorsement-list/:listId/endorsement should fail and return 403 error if scope is missing`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })
    const response: { body: Endorsement[] } = await request(app.getHttpServer())
      .get('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c8/endorsement')
      .send()
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it(`GET /endorsement-list/:listId/endorsement should return 404 and error if list does not exist`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })
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
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })
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
