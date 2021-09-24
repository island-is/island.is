import { GenericScope } from '@island.is/auth/scopes'
import request from 'supertest'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { authNationalId } from './seed'

describe('findEndorsementsEndorsementList', () => {
  it(`GET /endorsement-list/endorsements should fail and return 403 error if scope is missing`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })

    const response = await request(app.getHttpServer())
      .get('/endorsement-list/endorsements')
      .send()
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it(`GET /endorsement-list/endorsements should return 200 and a list of endorsements`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })

    const response = await request(app.getHttpServer())
      .get('/endorsement-list/endorsements')
      .send()
      .expect(200)

    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body).toHaveLength(2)
  })
})
