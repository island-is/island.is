import request from 'supertest'
import { EndorsementsScope } from '@island.is/auth/scopes'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { authNationalId } from './seed'

const newEndorsementList = {
  "title": "string",
  "description": "string",
  "endorsementMetadata": [
    {
      "field": "fullName"
    }
  ],
  "tags": [
    "generalPetition"
  ],
  "meta": {"email":"asdf@asdf.is","phone":"5559999"},
  "closedDate": "2029-06-12T15:31:00.254Z",
  "openedDate": "2023-06-12T15:31:00.254Z",
  "adminLock": false
}


describe('updateEndorsementList', () => {


  it(`PUT /endorsement-list should return 200 OK if scope is admin`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.admin],
    })

  
    // create one ...
    const createResponse = await request(app.getHttpServer())
      .post('/endorsement-list')
      .send(newEndorsementList)
      .expect(201)
    
    // to lock one ...
    const updateResponse = await request(app.getHttpServer())
      .put('/endorsement-list/'+createResponse.body.id+'/lock')
      .send()
      .expect(200)

  })

  it(`PUT /endorsement-list should return 200 OK if scope is admin`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.admin],
    })

  
    // create one ...
    const createResponse = await request(app.getHttpServer())
      .post('/endorsement-list')
      .send(newEndorsementList)
      .expect(201)
    
    // to unlock one ...
    const updateResponse = await request(app.getHttpServer())
      .put('/endorsement-list/'+createResponse.body.id+'/unlock')
      .send()
      .expect(200)

  })

  it(`rafnarnason`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.admin],
    })

    const payload = {
      "title": "string",
      "description": "string",
      "closedDate": "2023-06-26T14:51:20.717Z",
      "openedDate": "2023-06-26T14:51:20.717Z"
    }
  
    // create one ...
    const createResponse = await request(app.getHttpServer())
      .post('/endorsement-list')
      .send(newEndorsementList)
      .expect(201)
    
    // to update one ...
    const updateResponse = await request(app.getHttpServer())
      .put('/endorsement-list/'+createResponse.body.id+'/update')
      .send(payload)
      .expect(200)

  })

})
