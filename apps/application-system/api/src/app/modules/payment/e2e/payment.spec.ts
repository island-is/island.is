import { faker } from '@island.is/shared/mocking'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { createCurrentUser } from '@island.is/testing/fixtures'

import { setup } from '../../../../../test/setup'
import { PaymentAPI } from '@island.is/clients/payment'
import { CreateChargeInput } from '../dto/createChargeInput.dto'
import { AppModule } from '../../../app.module'
import { ApplicationTypes } from '@island.is/application/types'
import { ContentfulRepository } from '@island.is/cms'

let app: INestApplication

const TARGET_CHARGE_ITEM_CODE = 'asdf'

class MockContentfulRepository {
  async getLocalizedEntries() {
    return {
      items: [
        {
          fields: [
            {
              fields: {
                strings: {
                  en: {},
                  'is-IS': {},
                },
              },
            },
          ],
        },
      ],
    }
  }
}

class MockPaymentApi {
  async createCharge() {
    return {
      user4: faker.datatype.number(),
      receptionID: faker.datatype.number(),
    }
  }
  async getCatalog() {
    return {
      item: [...Array.from({ length: 10 })].map((_, i) => ({
        performingOrgID: faker.datatype.number(),
        chargeType: faker.random.word(),
        chargeItemCode:
          i === 1 ? TARGET_CHARGE_ITEM_CODE : faker.random.words(),
        chargeItemName: faker.random.word(),
        priceAmount: faker.datatype.number(),
      })),
    }
  }
}

let server: request.SuperTest<request.Test>
const nationalId = createCurrentUser().nationalId

beforeAll(async () => {
  app = await setup(AppModule, {
    override: (builder) =>
      builder
        .overrideProvider(ContentfulRepository)
        .useClass(MockContentfulRepository)
        .overrideProvider(PaymentAPI)
        .useClass(MockPaymentApi)
        .overrideGuard(IdsUserGuard)
        .useValue(
          new MockAuthGuard({
            nationalId,
            scope: [ApplicationScope.read, ApplicationScope.write],
          }),
        ),
  })

  server = request(app.getHttpServer())
})

describe('Application system payments API', () => {
  // Creating a new application
  it(`POST /application/{id}/payment should create a payment object and get fulfilled status`, async () => {
    // Act

    const applicationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.DRIVING_LICENSE,
      })
      .expect(201)

    const response = await server
      .post(`/applications/${applicationResponse.body.id}/payment`)
      .send({
        chargeItemCode: TARGET_CHARGE_ITEM_CODE,
      } as CreateChargeInput)
      .expect(201)

    // Assert
    expect(response.body.paymentUrl).toBeTruthy()

    await server
      .get(`/applications/${applicationResponse.body.id}/payment-status`)
      .send({
        applicationId: applicationResponse.body.id,
      })
      .expect(200)
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
})
