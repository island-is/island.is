import request from 'supertest'
import { INestApplication } from '@nestjs/common'

import { setup } from '../../../../../../test/setup'
import { AppModule } from '../../../../app.module'

let app: INestApplication

let server: request.SuperTest<request.Test>

beforeAll(async () => {
  app = await setup(AppModule)
  server = request(app.getHttpServer())
})

describe('Application system payments callback API', () => {
  // Sets the payment status to paid.
  it(`POST /application-payment/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/6b11dc9f-a694-440e-b3dd-7163b5f34815 should update payment fulfilled`, async () => {
    const response = await server
      .post(
        '/application-payment/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/6b11dc9f-a694-440e-b3dd-7163b5f34815',
      )
      .send({
        receptionID: '123e4567-e89b-12d3-a456-426614174000', // Updated to real UUID
        chargeItemSubject: 'Very nice subject',
        status: 'paid',
      })
    expect(response.status).toBe(201)
  })

  // Fails to set the payment status to paid.
  it(`POST /application-payment/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/missing-id should not update payment fulfilled`, async () => {
    await server
      .post(
        '/application-payment/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/missing-id',
      )
      .send({
        receptionID: '123e4567-e89b-12d3-a456-426614174000', // Updated to real UUID
        chargeItemSubject: 'nice subject.. not',
        status: 'paid',
      })
      .expect(400)
  })
})
