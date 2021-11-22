import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'

import { setup } from '../../../../../test/setup'
import { PaymentAPI } from '@island.is/clients/payment'
import { CreateChargeInput } from '../dto/createChargeInput.dto'
import { PaymentService } from '../payment.service'

let app: INestApplication

class MockPaymentApi {
  async createCharge() {
    return {
      user4: 'user4',
      receptionID: 'receptionid',
    }
  }
  async getCatalogByPerformingOrg() {
    const json = {
      item: [
        {
          performingOrgID: '6509142520',
          chargeType: 'AY1',
          chargeItemCode: 'AY101',
          chargeItemName: 'Sakarvottorð',
          priceAmount: 2500,
        },
        {
          performingOrgID: '6509142520',
          chargeType: 'AY1',
          chargeItemCode: 'AY102',
          chargeItemName: 'Veðbókarvottorð',
          priceAmount: 2000,
        },
        {
          performingOrgID: '6509142520',
          chargeType: 'AY1',
          chargeItemCode: 'AY110',
          chargeItemName: 'Ökuskírteini',
          priceAmount: 8000,
        },
      ],
    }
    return json
  }
}

class MockPaymentService {
  async findApplicationById() {
    return {
      typeId: 'DrivingLicense',
    }
  }

  async searchCorrectCatalog() {
    return {
      performingOrgID: '6509142520',
      chargeType: 'AY1',
      chargeItemCode: 'AY110',
      chargeItemName: 'Ökuskírteini',
      priceAmount: 8000,
    }
  }

  async createCharge() {
    return {
      user4: 'amazing-user4-code-for-url',
      receptionID: '96b5333b-6666-9999-1111-e8feb01d3dcd',
      paymentUrl: 'www.nice-url.island.is',
    }
  }

  async findPaymentByApplicationId() {
    return {
      fulfilled: true,
    }
  }
}

const nationalId = '1234564321'
let server: request.SuperTest<request.Test>

beforeAll(async () => {
  app = await setup({
    override: (builder) =>
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
        .overrideProvider(PaymentService)
        .useClass(MockPaymentService),
  })

  server = request(app.getHttpServer())
})

describe('Application system payments API', () => {
  // Creating a new application
  it(`POST /application/96b5237b-6896-4154-898d-e8feb01d3dcd/payment should create a payment object`, async () => {
    // Act
    const response = await server
      .post('/applications/96b5237b-6896-4154-898d-d8feb01d3dcd/payment')
      .send({
        chargeItemCode: 'AY110',
      } as CreateChargeInput)
      .expect(201)

    // Assert
    expect(response.body.paymentUrl).toBeTruthy()
  })

  // Should fail creating payment due to bad application ID.
  it(`POST /application/96b5237b/payment should fail creating a payment object`, async () => {
    // Act
    const response = await server
      .post('/applications/96b5237b/payment')
      .expect(400)

    // Assert
    expect(response.body.paymentUrl).toBeFalsy()
  })

  // Not finding the application - when trying to get application payment status.
  it(`GET /application/1234567890/payment-status should return not found - bad applicationID`, async () => {
    const response = await server
      .get('/applications/1234567890/payment-status')
      .expect(400)

    expect(response.body.fulfilled).toBeFalsy
  })

  // Getting the payment status
  it(`GET /application/96b5237b-6896-4154-898d-d8feb01d3dcd/payment-status should get payment fulfilled status`, async () => {
    await server
      .get('/applications/96b5237b-6896-4154-898d-d8feb01d3dcd/payment-status')
      .send({
        applicationId: '96b5237b-6896-4154-898d-d8feb01d3dcd',
      })
      .expect(200)
  })
})
