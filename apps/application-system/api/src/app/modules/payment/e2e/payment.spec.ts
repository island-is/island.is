import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'

import { setup } from '../../../../../test/setup'
import { PaymentAPI } from '@island.is/clients/payment'

let app: INestApplication

class MockPaymentApi {
  async createCharge () {
    return {
      user4: 'user4',
      receptionID: 'receptionid',
    }
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

  // TODO: Validate that an application that is in a state that should be pruned
  // is not listed when (mocked) Date.now > application.pruneAt
})
