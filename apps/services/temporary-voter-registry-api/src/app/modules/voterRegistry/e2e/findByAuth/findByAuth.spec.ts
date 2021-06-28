import { getAuthenticatedApp } from '../../../../../../test/setup'
import {
  emptyResponseExpectedStructure,
  errorExpectedStructure,
} from '../../../../../../test/testHelpers'
import request from 'supertest'

describe('findByAuthVoterRegistry', () => {
  it('GET /voter-registry should return error when auth does not have the requested scope', async () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalId = '0101302989'
    const app = await getAuthenticatedApp({ nationalId, scope: [] })
    const response = await request(app.getHttpServer())
      .get('/voter-registry')
      .send()
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it('GET /voter-registry should return not registered response when trying to fetch older version', async () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalId = '0101303019'
    const app = await getAuthenticatedApp({ nationalId })
    const response = await request(app.getHttpServer())
      .get('/voter-registry')
      .send()
      .expect(200)

    expect(response.body).toMatchObject({
      ...emptyResponseExpectedStructure,
      nationalId,
    })
  })
  it('GET /voter-registry should return entry from current version', async () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalId = '0101302989'
    const app = await getAuthenticatedApp({ nationalId })
    const response = await request(app.getHttpServer())
      .get('/voter-registry')
      .send()
      .expect(200)

    expect(response.body).toMatchObject({
      nationalId,
      version: 3,
    })
  })
})
