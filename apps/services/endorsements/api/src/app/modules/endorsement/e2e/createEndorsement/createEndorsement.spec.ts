import { GenericScope } from '@island.is/auth/scopes'
import request from 'supertest'
import {
  errorExpectedStructure,
  metaDataResponse,
} from '../../../../../../test/testHelpers'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { authNationalId } from './seed'

describe('createEndorsement', () => {
  it(`POST /endorsement-list/:listId/endorsement should fail and return 403 error if scope is missing`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })

    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba011/endorsement`,
      )
      .send()
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it(`POST /endorsement-list/:listId/endorsement should return 404 when supplied with a non existing list`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })

    const endorsementBody = {
      showName: true,
    }
    const response = await request(app.getHttpServer())
      .post(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/endorsement',
      )
      .send(endorsementBody)
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`POST /endorsement-list/:listId/endorsement should fail to create endorsement on a closed list`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })
    const endorsementBody = {
      showName: true,
    }
    const response = await request(app.getHttpServer())
      .post(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c4/endorsement',
      )
      .send(endorsementBody)
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  it(`POST /endorsement-list/:listId/endorsement should fail to create endorsement when conflicts within tags`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })
    const endorsementBody = {
      showName: true,
    }
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c5/endorsement`,
      )
      .send(endorsementBody)
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
    })
  })
  it(`POST /endorsement-list/:listId/endorsement should create a new endorsement and populate metadata`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })
    const endorsementBody = {
      showName: true,
    }
    const listId = '9c0b4106-4213-43be-a6b2-ff324f4ba011'
    const response = await request(app.getHttpServer())
      .post(`/endorsement-list/${listId}/endorsement`)
      .send(endorsementBody)
      .expect(201)

    // should return the created object
    expect(response.body).toMatchObject({
      endorsementListId: listId,
      // lets make sure metadata got populated
      meta: metaDataResponse,
    })
  })
})
