import { EndorsementsScope } from '@island.is/auth/scopes'
import request from 'supertest'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { authNationalId } from './seed'

describe('emailPdfEndorsement', () => {
  it(`POST /endorsement-list/:listId/endorsement/email-pdf no scope unauthorized`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/baf5df09-3a4f-41e1-a96e-445021a02ac0/endorsement/email-pdf?emailAddress=rafn@juni.is`,
      )
      .send()
      .expect(404)

    expect(response.body.statusCode).toEqual(401)
  })
  it(`POST /endorsement-list/:listId/endorsement/email-pdf should fail trying to send list you dont own`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/baf5df09-3a4f-41e1-a96e-445021a02ac0/endorsement/email-pdf?emailAddress=rafn@juni.is`,
      )
      .send()
      .expect(404)

    expect(response.body.statusCode).toEqual(404)
    expect(response.body.success).toBe(false)
  })

  it(`POST /endorsement-list/:listId/endorsement/email-pdf admin can send any list`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.admin],
    })
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/baf5df09-3a4f-41e1-a96e-445021a02ac0/endorsement/email-pdf?emailAddress=rafn@juni.is`,
      )
      .send()
      .expect(201)

    expect(response.body.statusCode).toEqual(201)
    expect(response.body.success).toBe(true)
  })
})
