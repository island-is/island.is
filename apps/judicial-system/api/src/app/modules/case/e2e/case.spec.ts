import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('Application', () => {
  it(`POST /case should create a case`, async () => {
    // Act
    const response = await request(app.getHttpServer())
      .post('/api/case')
      .send({
        policeCaseNumber: 'Case Number',
        suspectNationalId: '0101010000',
      })
      .expect(201)

    // Assert
    expect(response.body.id).toBeTruthy()
  })
})
