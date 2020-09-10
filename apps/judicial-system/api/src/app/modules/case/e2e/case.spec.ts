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
      })
      .expect(201)

    expect(response.body.id).toBeTruthy()
  })
})
