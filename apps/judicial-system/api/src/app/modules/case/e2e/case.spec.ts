import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

import { setup } from '../../../../../test/setup'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('Application', () => {
  it(`POST /case should create a case`, async () => {
    const response = await request(app.getHttpServer())
      .post('/api/case')
      .send({
        policeCaseNumber: 'Case Number',
        suspectNationalId: '0101010000',
        suspectName: 'Suspect Name',
        suspectAddress: 'Suspect Address',
        court: 'Court',
        arrestDate: '2020-09-08T08:00:00.000Z',
        requestedCourtDate: '2020-09-08T11:30:00.000Z',
      })
      .expect(201)

    expect(response.body.id).toBeTruthy()
  })
})
