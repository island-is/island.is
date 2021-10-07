import { EndorsementsScope } from '@island.is/auth/scopes'
import request from 'supertest'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { authNationalId } from './seed'

describe('openEndorsementList', () => {
  it(`PUT /endorsement-list/:listId/open should fail and return 403 error if scope is missing`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })
    const response = await request(app.getHttpServer())
      .put('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba018/open')
      .send()
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it(`PUT /endorsement-list/:listId/open should return 404 when opening an non existing list`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .put('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/open')
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`PUT /endorsement-list/:listId/open should fail to open existing closed endorsement list if not in any access group`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: '0000000000',
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .put('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba018/open')
      .send()
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  it(`PUT /endorsement-list/:listId/open should open existing closed endorsement list`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const closedDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const newDate = {
      closedDate: closedDate,
    }
    const response = await request(app.getHttpServer())
      .put('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba018/open')
      .send(newDate)
      .expect(200)

    expect(response.body).toMatchObject({ closedDate: closedDate })
  })
})
