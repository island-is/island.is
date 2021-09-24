import { getAuthenticatedApp } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import request from 'supertest'
import { GenericScope } from '@island.is/auth/scopes'

describe('CreatePartyLetterRegistry', () => {
  it('POST /party-letter-registry should fail and return 403 error if scope is missing', async () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalId = '0101302209'
    const app = await getAuthenticatedApp({
      scope: [],
      nationalId,
    })
    const requestData = {
      partyLetter: 'V',
      partyName: 'The awesome party',
      owner: nationalId,
      managers: [nationalId],
    }
    const response = await request(app.getHttpServer())
      .post('/party-letter-registry')
      .send(requestData)
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it('POST /party-letter-registry should return error when data is invalid', async () => {
    const app = await getAuthenticatedApp({
      scope: [GenericScope.internal],
      // eslint-disable-next-line local-rules/disallow-kennitalas
      nationalId: '0101302209',
    })
    const requestData = {
      partyLetter: 'Z',
      partyName: 'The awesome party',
      owner: '0000000002', // invalid national id
      managers: ['0000000001'], // invalid national id
    }
    const response = await request(app.getHttpServer())
      .post('/party-letter-registry')
      .send(requestData)
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
    })
  })
  it('POST /party-letter-registry should fail to assign an existing letter', async () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalId = '0101305069'
    const app = await getAuthenticatedApp({
      scope: [GenericScope.internal],
      nationalId,
    })
    const requestData = {
      partyLetter: 'Y',
      partyName: 'The awesome party',
      owner: nationalId,
      managers: [nationalId],
    }
    const response = await request(app.getHttpServer())
      .post('/party-letter-registry')
      .send(requestData)
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  it('POST /party-letter-registry should create a new entry', async () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalId = '0101303019'
    const app = await getAuthenticatedApp({
      scope: [GenericScope.internal],
      nationalId,
    })
    const requestData = {
      partyLetter: 'V',
      partyName: 'The awesome party',
      owner: nationalId,
      managers: [nationalId],
    }
    const response = await request(app.getHttpServer())
      .post('/party-letter-registry')
      .send(requestData)
      .expect(201)

    expect(response.body).toMatchObject(requestData)
  })
})
