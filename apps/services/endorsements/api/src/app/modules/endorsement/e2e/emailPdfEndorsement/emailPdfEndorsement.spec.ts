import { EndorsementsScope } from '@island.is/auth/scopes'
import request from 'supertest'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { authNationalId } from './seed'

describe('emailPdfEndorsement', () => {
  it(`POST /endorsement-list/:listId/endorsement should fail trying to send list you dont own`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/cb3f3185-a3f8-42d1-8206-212cbb943aaf/endorsement/email-pdf?emailAddress=VALID@EMAIL.is`,
      )
      .send()
      .expect(404)
    expect(response.body.statusCode).toEqual(404)
  })

  it(`POST /endorsement-list/:listId/endorsement invalid email should fail`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/aa042d38-9ff8-45b7-b0b2-9ca1d9cec543/endorsement/email-pdf?emailAddress=NOT_A_VALID_EMAIL_ADDRESS.is`,
      )
      .send()
      .expect(400)

    expect(response.body.statusCode).toEqual(400)
  })

  it(`POST /endorsement-list/:listId/endorsement should work sending a list you own`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/aa042d38-9ff8-45b7-b0b2-9ca1d9cec543/endorsement/email-pdf?emailAddress=VALID@EMAIL.is`,
      )
      .send()
      .expect(201)

    expect(response.body.success).toBe(true)
  })
})
