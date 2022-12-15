import { ApplicationService } from '@island.is/application/api/core'
import {
  Catalog,
  Charge,
  ChargeResponse,
  PaymentAPI,
} from '@island.is/clients/payment'

import {
  PaymentModule,
  PaymentService,
} from '@island.is/application/api/payment'

import { AppModule } from '../../../../app.module'
import { setup } from '../../../../../../test/setup'
import { INestApplication } from '@nestjs/common'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { faker } from '@island.is/shared/mocking'
import { ApplicationTypes } from '@island.is/application/types'

let app: INestApplication
let service: PaymentService
const applicationId = faker.datatype.uuid()
const user = createCurrentUser()

class MockPaymentApi {
  async createCharge(upcomingPayment: Charge): Promise<ChargeResponse> {
    upcomingPayment
    return Promise.resolve({
      user4: '1',
      receptionID: upcomingPayment.requestID,
    })
  }
  getCatalog() {
    return Promise.resolve<Catalog>({
      item: [
        {
          performingOrgID: '1',
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
    const application = {
      id: applicationId,
      typeId: ApplicationTypes.EXAMPLE_PAYMENT,
      state: 'draft',
      assignees: [],
      attachments: {},
      answers: {},
      externalData: {},
      created: new Date(),
      modified: new Date(),
      applicant: '1',
      assignNonces: [],
      pruned: false,
    }
    return Promise.resolve(application)
  }
}

describe('Payment Service', () => {
  beforeAll(async () => {
    app = await setup(AppModule, {
      override: (builder) =>
        builder
          .overrideProvider(PaymentAPI)
          .useClass(MockPaymentApi)
          .overrideProvider(ApplicationService)
          .useClass(MockApplicationService),
    })

    service = app.get<PaymentService>(PaymentService)
  })

  it('should create a charge', async () => {
    const chargeItemCodes: string[] = ['asdf']

    const result = await service.createCharge(
      user,
      chargeItemCodes,
      applicationId,
    )

    expect(result).toBeTruthy()
  })

  it('should create a charge with multiple charge items', async () => {
    const chargeItemCodes: string[] = ['asdf', 'asdf']

    const result = await service.createCharge(
      user,
      chargeItemCodes,
      applicationId,
    )

    expect(result).toBeTruthy()
  })

  it('should throw an error when charge item is not found', async () => {
    const chargeItemCodes: string[] = ['13']

    await expect(
      service.createCharge(user, chargeItemCodes, applicationId),
    ).rejects.toThrow()
  })

  it('should get a payment status', async () => {
    const chargeItemCodes: string[] = ['asdf', 'asdf']

    await service.createCharge(user, chargeItemCodes, applicationId)
    const result = await service.getStatus(user, applicationId)
    expect(result.fulfilled).toBe(false)
  })

  it('should get a fulfilled payment status', async () => {
    const chargeItemCodes: string[] = ['asdf', 'asdf']

    const { id } = await service.createCharge(
      user,
      chargeItemCodes,
      applicationId,
    )

    await service.fulfillPayment(id, faker.datatype.uuid(), applicationId)
    const result = await service.getStatus(user, applicationId)
    expect(result.fulfilled).toBe(true)
  })
})
