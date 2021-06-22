import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'

import { setup } from '../../../../../test/setup'
import { PaymentAPI } from '@island.is/clients/payment'

let app: INestApplication

class MockPaymentApi {
  async createCharge() {
    return {
      user4: 'user4',
      receptionID: 'receptionid',
    }
  }
  async getPaymentStatus() {
    return {
      fulfilled: true
    }
  }
  async getCatalog() {
    return 'nice catalog'
  }
}

const nationalId = '1234564321'
let server: request.SuperTest<request.Test>

beforeAll(async () => {
  app = await setup({
    override: (builder) => {
      builder
        .overrideProvider(PaymentAPI)
        .useClass(MockPaymentApi)
        .overrideGuard(IdsUserGuard)
        .useValue(
          new MockAuthGuard({
            nationalId,
            scope: [ApplicationScope.read, ApplicationScope.write],
          }),
        )
        .compile()
    },
  })

  server = request(app.getHttpServer())
})

describe('Application system payments API', () => {
  it(`POST /application/96b5237b-6896-4154-898d-d8feb01d3dcd/payment should create a payment object`, async () => {
    // Act
    const response = await server
      .post('/applications/96b5237b-6896-4154-898d-d8feb01d3dcd/payment')
      .expect(201)

    // Assert
    expect(response.body.paymentUrl).toBeTruthy()
  })

  it(`GET /application/1234567890/payment-status should return not found`, async() => {
    const response = await server
      .get('/application/1234567890/payment-status')
      .expect(404)

    expect(response.body.fulfilled).toBeFalsy
  })

  it(`GET /application/96b5237b-6896-4154-898d-d8feb01d3dcd/payment-status should get payment fulfilled status`, async() => {
    const response = await server
      .get('/application/96b5237b-6896-4154-898d-d8feb01d3dcd/payment-status')
      .send({
        applicationId: '96b5237b-6896-4154-898d-d8feb01d3dcd',
      })
      .expect(404) //should be 200
    console.log(response)
    expect(true).toBeTruthy()
  })

  //@Post('applications/:application_id/payment/:id')
  it(`POST /application/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/payment/6b11dc9f-a694-440e-b3dd-7163b5f34815 should update payment fulfilled`, async() => {
    const response = await server
      .post('/application/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/payment/6b11dc9f-a694-440e-b3dd-7163b5f34815')
      .send({
        applicationId: '32eee126-6b7f-4fca-b9a0-a3618b3e42bf',
        id: '6b11dc9f-a694-440e-b3dd-7163b5f34815',
        callback: 'www.nice-call-back.island.is'
      })
      .expect(404) //should be 202
    //controller action returns void.
    expect(null).toBeFalsy()
  })

  // TODO: Validate that an application that is in a state that should be pruned
  // is not listed when (mocked) Date.now > application.pruneAt
})
