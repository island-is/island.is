import { getAuthenticatedApp } from '../../../../../../test/setup'
import {
  emptyResponseExpectedStructure,
  errorExpectedStructure,
} from '../../../../../../test/testHelpers'
import request from 'supertest'
import { GenericScope } from '@island.is/auth/scopes'

describe('findByAuthVoterRegistry', () => {
  it('GET /voter-registry/system should return error when auth does not have the requested scope', async () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalId = '0101304929'
    const app = await getAuthenticatedApp({ nationalId, scope: [] })
    const response = await request(app.getHttpServer())
      .get(`/voter-registry/system?nationalId=${nationalId}`)
      .send({ nationalId })
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it('GET /voter-registry/system should return not registered response when trying to fetch older version', async () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalId = '0101304339'
    const app = await getAuthenticatedApp({
      nationalId,
      scope: [GenericScope.system],
    })
    const response = await request(app.getHttpServer())
      .get(`/voter-registry/system?nationalId=${nationalId}`)
      .send({ nationalId })
      .expect(200)

    expect(response.body).toMatchObject({
      ...emptyResponseExpectedStructure,
      nationalId,
    })
  })
  it('GET /voter-registry/system should return entry from current version', async () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalId = '0101307789'
    const app = await getAuthenticatedApp({
      nationalId,
      scope: [GenericScope.system],
    })
    const response = await request(app.getHttpServer())
      .get(`/voter-registry/system?nationalId=${nationalId}`)
      .send()
      .expect(200)

    expect(response.body).toMatchObject({
      nationalId,
      version: 3,
    })
  })
})
