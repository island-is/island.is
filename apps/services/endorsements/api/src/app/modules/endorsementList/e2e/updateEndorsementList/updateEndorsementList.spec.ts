import request from 'supertest'
import { EndorsementsScope } from '@island.is/auth/scopes'
import { getAuthenticatedApp } from '../../../../../../test/setup'
const authNationalId = '0000000011'

const newEndorsementList = {
  title: 'string',
  description: 'string',
  endorsementMetadata: [
    {
      field: 'fullName',
    },
  ],
  tags: ['generalPetition'],
  meta: { email: 'asdf@asdf.is', phone: '5559999' },
  closedDate: '2029-06-12T15:31:00.254Z',
  openedDate: '2023-06-12T15:31:00.254Z',
  adminLock: false,
}

describe('updateEndorsementList admin scope', () => {
  it(`PUT /endorsement-list should return 200 OK on admin lock`, async () => {
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
    await request(app.getHttpServer())
      .put('/endorsement-list/' + createResponse.body.id + '/lock')
      .send()
      .expect(200)
  })

  it(`PUT /endorsement-list should return 200 OK on admin unlock`, async () => {
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
    await request(app.getHttpServer())
      .put('/endorsement-list/' + createResponse.body.id + '/unlock')
      .send()
      .expect(200)
  })

  it(`PUT /endorsement-list should return 200 OK on admin update`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.admin],
    })

    const payload = {
      title: 'string',
      description: 'string',
      closedDate: '2023-06-26T14:51:20.717Z',
      openedDate: '2023-06-26T14:51:20.717Z',
    }

    // create one ...
    const createResponse = await request(app.getHttpServer())
      .post('/endorsement-list')
      .send(newEndorsementList)
      .expect(201)

    // to update one ...
    await request(app.getHttpServer())
      .put('/endorsement-list/' + createResponse.body.id + '/update')
      .send(payload)
      .expect(200)
  })
})
