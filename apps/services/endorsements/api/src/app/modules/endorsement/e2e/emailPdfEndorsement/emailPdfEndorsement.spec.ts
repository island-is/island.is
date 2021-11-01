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
        `/endorsement-list/baf5df09-3a4f-41e1-a96e-445021a02ac0/endorsement/email-pdf?emailAddress=rafn@juni.is`,
      )
      .send()
      .expect(404)
    
    expect(response.body.statusCode).toEqual(404)
    expect(response.body.success).toBeFalsy()
  })

  it(`POST /endorsement-list/:listId/endorsement should fail trying to send list you own but to an invalid emailAddress`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .post(`/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c4/endorsement/email-pdf?emailAddress=rafn[AT]juni.DOT.is`)
      .send()
      .expect(400)

    expect(response.body.statusCode).toEqual(400)
  })
  
  it(`POST /endorsement-list/:listId/endorsement/?emailAdress=VALIDEMAIL should work sending a list you own`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .post(`/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c4/endorsement/email-pdf?emailAddress=rafn@juni.is`)
      .send()
      .expect(201)

      expect(response.body.success).toBeTruthy()
  })
})
