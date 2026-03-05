import { faker } from '@island.is/shared/mocking'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { createCurrentUser } from '@island.is/testing/fixtures'

import { setup } from '../../../../../../test/setup'
import {
  ChargeFjsV2ClientService,
  Charge,
  ChargeResponse,
  Catalog,
} from '@island.is/clients/charge-fjs-v2'
import { PaymentService } from '@island.is/application/api/payment'
import { AppModule } from '../../../../app.module'
import { ApplicationService } from '@island.is/application/api/core'

let app: INestApplication

const TARGET_CHARGE_ITEM_CODE = 'asdf'

class MockChargeFjsV2ClientService {
  async createCharge(upcomingPayment: Charge): Promise<ChargeResponse> {
    upcomingPayment
    return Promise.resolve({
      user4: '1',
      receptionID: upcomingPayment.requestID,
    })
  }
  getCatalogByPerformingOrg({ performingOrgID }: { performingOrgID: string }) {
    return Promise.resolve<Catalog>({
      item: [
        {
          performingOrgID,
          chargeType: '1',
          chargeItemCode: 'asdf',
          chargeItemName: '1',
          priceAmount: 1,
        },
      ],
    })
  }
}

class MockApplicationService {
  async findOneById() {
    return {
      typeId: 'DrivingLicense',
    }
  }
}
// TODO: mock the client instead - we are essentially not testing the service
class MockPaymentService {
  async findApplicationById() {
    return {
      typeId: 'DrivingLicense',
    }
  }

  async findCatalogChargeItems() {
    return [
      {
        performingOrgID: faker.datatype.number(),
        chargeType: faker.random.word(),
        chargeItemCode: TARGET_CHARGE_ITEM_CODE,
        chargeItemName: faker.random.word(),
        priceAmount: faker.datatype.number(),
      },
    ]
  }

  async createCharge() {
    return {
      user4: 'amazing-user4-code-for-url',
      receptionID: '96b5333b-6666-9999-1111-e8feb01d3dcd',
      paymentUrl: 'www.nice-url.island.is',
    }
  }

  makePaymentUrl() {
    return 'asdf'
  }

  makeDelegationPaymentUrl() {
    return 'paymentUrl'
  }

  async findPaymentByApplicationId() {
    return {
      fulfilled: true,
      user4: 'amazing-user4-code-for-url',
    }
  }
}

let server: request.SuperTest<request.Test>
const nationalId = createCurrentUser().nationalId

beforeAll(async () => {
  app = await setup(AppModule, {
    override: (builder) =>
      builder
        .overrideProvider(ApplicationService)
        .useClass(MockApplicationService)
        .overrideProvider(ChargeFjsV2ClientService)
        .useClass(MockChargeFjsV2ClientService)
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
  // Not finding the application - when trying to get application payment status.
  it(`GET /application/1234567890/payment-status should return not found - bad applicationID`, async () => {
    const response = await server
      .get('/applications/1234567890/payment-status')
      .expect(400)

    expect(response.body.fulfilled).toBeFalsy
  })
})
