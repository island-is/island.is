import { EndorsementsScope } from '@island.is/auth/scopes'
import request from 'supertest'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { authNationalId } from './seed'


describe('emailPdfEndorsement', () => {

  it(`POST /endorsement-list/:listId/endorsement/email-pdf should fail and return 404 with BOGUS ID`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/baf5df09-3a4f-41e1-a96e-445021a02ac1/endorsement/email-pdf?emailAddress=rafn@juni.is`,
      )
      .send()
      .expect(404)

    expect(response.body.statusCode).toEqual(404)
  })

  it(`POST /endorsement-list/:listId/endorsement/email-pdf should fail and return 403 error if scope is missing`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/baf5df09-3a4f-41e1-a96e-445021a02ac0/endorsement/email-pdf?emailAddress=rafn@juni.is`,
      )
      .send()
      .expect(403)

    expect(response.body.statusCode).toEqual(403)
  })
  it(`POST /endorsement-list/:listId/endorsement/email-pdf should fail trying to send list you do NOT own`, async () => {
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
  })

  it(`POST /endorsement-list/:listId/endorsement/email-pdf should succeed trying to send list you own`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/7d6c2b91-8d8d-42d0-82f7-cd64ce16d753/endorsement/email-pdf?emailAddress=rafn@juni.is`,
      )
      .send()
      .expect(201)

    expect(response.body.success).toBe(true)
  })

 
})
