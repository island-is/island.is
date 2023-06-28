import { EndorsementsScope } from '@island.is/auth/scopes'
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
      scope: [EndorsementsScope.main],
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
      scope: [EndorsementsScope.main],
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
})
