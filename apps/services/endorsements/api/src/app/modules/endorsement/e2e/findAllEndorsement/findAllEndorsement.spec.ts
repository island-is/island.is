import request from 'supertest'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { Endorsement } from '../../models/endorsement.model'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { authNationalId } from './seed'
import { GenericScope } from '@island.is/auth/scopes'
import { PaginatedEndorsementDto } from '../../dto/paginatedEndorsement.dto'

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
    const response: { body: PaginatedEndorsementDto } = await request(
      app.getHttpServer(),
    )
      .get('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c8/endorsement')
      .send()
      .expect(200)

    for (const endorsementResponse of response.body.data) {
      const endorsement = new Endorsement(endorsementResponse) // we know we have at least one endorsement
      await expect(endorsement.validate()).resolves.not.toThrow()
    }

    expect(response.body.data).toHaveLength(2)
  })

  // general petition tests
  it(`GET /endorsement-list/:listId/endorsement/general-petition should return 404 requesting a non gp list`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })
    const response: { body: PaginatedEndorsementDto } = await request(
      app.getHttpServer(),
    )
      .get(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c8/endorsement/general-petition',
      )
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
    const response: { body: PaginatedEndorsementDto } = await request(
      app.getHttpServer(),
    )
      .get(
        '/endorsement-list/aa042d38-9ff8-45b7-b0b2-9ca1d9cec543/endorsement/general-petition?limit=2',
      )
      .send()
      .expect(200)

    for (const endorsementResponse of response.body.data) {
      const endorsement = new Endorsement(endorsementResponse)
      await expect(endorsement.validate()).resolves.not.toThrow()
    }

    expect(response.body.totalCount).toEqual(5)
    expect(response.body.data).toHaveLength(2)
    expect(response.body.pageInfo.hasNextPage).toBeTruthy()
    expect(response.body.pageInfo.hasPreviousPage).toBeFalsy()
  })
})
