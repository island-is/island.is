import request from 'supertest'
import { INestApplication } from '@nestjs/common'

import { setup } from '../../../../../test/setup'

let app: INestApplication

let server: request.SuperTest<request.Test>

beforeAll(async () => {
  app = await setup()
  server = request(app.getHttpServer())
})

describe('Application system payments callback API', () => {
  // Sets the payment status to paid.
  it(`POST /application-payment/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/6b11dc9f-a694-440e-b3dd-7163b5f34815 should update payment fulfilled`, async () => {
    await server
      .post(
        '/application-payment/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/6b11dc9f-a694-440e-b3dd-7163b5f34815',
      )
      .send({
        callback: {
          receptionID: '1234567890',
          chargeItemSubject: 'Very nice subject',
          status: 'paid',
        },
      })
      .expect(201)
  })

  // Fails to set the payment status to paid.
  it(`POST /application-payment/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/missing-id should not update payment fulfilled`, async () => {
    await server
      .post(
        '/application-payment/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/missing-id',
      )
      .send({
        callback: {
          receptionID: '1234567890',
          chargeItemSubject: 'nice subject.. not',
          status: 'paid',
        },
      })
      .expect(400)
  })
})
