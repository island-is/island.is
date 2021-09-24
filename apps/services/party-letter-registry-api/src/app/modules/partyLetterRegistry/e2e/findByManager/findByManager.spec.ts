import { getAuthenticatedApp } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import request from 'supertest'
import { GenericScope } from '@island.is/auth/scopes'

describe('FindByManagerPartyLetterRegistry', () => {
  it('GET /party-letter-registry/manager should return not found error when national owns no letters', async () => {
    const app = await getAuthenticatedApp({
      scope: [GenericScope.internal],
      // eslint-disable-next-line local-rules/disallow-kennitalas
      nationalId: '0101302209',
    })
    const response = await request(app.getHttpServer())
      .get(`/party-letter-registry/manager`)
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it('GET /party-letter-registry/manager should return error when scope is missing', async () => {
    const app = await getAuthenticatedApp({
      scope: [],
      // eslint-disable-next-line local-rules/disallow-kennitalas
      nationalId: '0101302209',
    })
    const response = await request(app.getHttpServer())
      .get(`/party-letter-registry/manager`)
      .send()
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it('GET /party-letter-registry/manager should return a party letter entry', async () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalId = '0101305069'
    const app = await getAuthenticatedApp({
      scope: [GenericScope.internal],
      nationalId,
    })
    const response = await request(app.getHttpServer())
      .get(`/party-letter-registry/manager`)
      .send()
      .expect(200)

    expect(response.body).toMatchObject({
      managers: [nationalId],
    })
  })
})
