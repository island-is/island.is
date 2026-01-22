import { ApplicationService } from '@island.is/application/api/core'
import {
  ChargeFjsV2ClientService,
  Charge,
  ChargeResponse,
  Catalog,
  ChargeStatusResultStatusEnum,
} from '@island.is/clients/charge-fjs-v2'

import { PaymentService } from '@island.is/application/api/payment'

import { AppModule } from '../../../../app.module'
import { setup } from '../../../../../../test/setup'
import { INestApplication } from '@nestjs/common'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { faker } from '@island.is/shared/mocking'
import { ApplicationTypes } from '@island.is/application/types'

let app: INestApplication
let service: PaymentService

let fjsClient: MockChargeFjsV2ClientService
const applicationId = faker.datatype.uuid()
const user = createCurrentUser()

class MockChargeFjsV2ClientService {
  async createCharge(upcomingPayment: Charge): Promise<ChargeResponse> {
    upcomingPayment
    return Promise.resolve({
      user4: '1',
      receptionID: upcomingPayment.requestID,
    })
  }

  getCatalogByPerformingOrg(performingOrganizationID: string) {
    return Promise.resolve<Catalog>({
      item: [
        {
          performingOrgID: performingOrganizationID,
          chargeType: '1',
          chargeItemCode: 'asdf',
          chargeItemName: '1',
          priceAmount: 1,
        },
        {
          performingOrgID: performingOrganizationID,
          chargeType: '1',
          chargeItemCode: 'asdf2',
          chargeItemName: '2',
          priceAmount: 2,
        },
      ],
    })
  }

  getChargeStatus(chargeId: string) {
    return Promise.resolve({
      statusResult: {
        docuNum: '1',
        status: ChargeStatusResultStatusEnum.InProgress,
      },
      error: {
        code: 200,
        message: '1',
      },
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
          .overrideProvider(ChargeFjsV2ClientService)
          .useClass(MockChargeFjsV2ClientService)
          .overrideProvider(ApplicationService)
          .useClass(MockApplicationService),
    })

    service = app.get<PaymentService>(PaymentService)
    fjsClient = app.get<MockChargeFjsV2ClientService>(ChargeFjsV2ClientService)
  })

  it('should create a charge', async () => {
    const performingOrganizationID = '1'
    const chargeItems = [{ code: 'asdf' }]

    const result = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItems,
      applicationId,
      undefined,
    )

    expect(result).toBeTruthy()
  })

  it('should create a charge with multiple charge items', async () => {
    const performingOrganizationID = '1'
    const chargeItems = [{ code: 'asdf' }, { code: 'asdf' }]

    const result = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItems,
      applicationId,
      undefined,
    )

    expect(result).toBeTruthy()
  })

  it('should create a charge with multiple charge items using quantity', async () => {
    const performingOrganizationID = '1'
    const chargeItems = [{ code: 'asdf', quantity: 3 }]

    const result = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItems,
      applicationId,
      undefined,
    )

    expect(result).toBeTruthy()
  })

  it('should throw an error when charge item is not found', async () => {
    const performingOrganizationID = '1'
    const chargeItems = [{ code: '13' }]

    await expect(
      service.createCharge(
        user,
        performingOrganizationID,
        chargeItems,
        applicationId,
        undefined,
      ),
    ).rejects.toThrow()
  })

  it('should get a payment status', async () => {
    const performingOrganizationID = '1'
    const chargeItems = [{ code: 'asdf' }, { code: 'asdf' }]

    const charge = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItems,
      applicationId,
      undefined,
    )

    const result = await service.getStatus(applicationId)
    expect(result.fulfilled).toBe(false)
  })

  it('should get a fulfilled payment status', async () => {
    const performingOrganizationID = '1'
    const chargeItems = [{ code: 'asdf' }, { code: 'asdf' }]

    const charge = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItems,
      applicationId,
      undefined,
    )

    await service.fulfillPayment(
      charge.id,
      faker.datatype.uuid(),
      applicationId,
    )
    const result = await service.getStatus(applicationId)
    expect(result.fulfilled).toBe(true)
  })

  it('should find charge items using quantity', async () => {
    const performingOrganizationID = '1'
    const chargeItems = [
      { code: 'asdf', quantity: 2 },
      { code: 'asdf2', quantity: 3 },
    ]

    const catalogChargeItems = await service.findCatalogChargeItems(
      performingOrganizationID,
      chargeItems,
    )

    // make sure quantity is correct for item 1 (code 'asdf')
    const catalogQuantityItem1 = catalogChargeItems.find(
      ({ chargeItemCode }) => chargeItemCode === chargeItems[0].code,
    )?.quantity
    expect(catalogQuantityItem1).toBe(chargeItems[0].quantity)

    // make sure quantity is correct for item 2 (code 'asdf2')
    const catalogQuantityItem2 = catalogChargeItems.find(
      ({ chargeItemCode }) => chargeItemCode === chargeItems[1].code,
    )?.quantity
    expect(catalogQuantityItem2).toBe(chargeItems[1].quantity)

    // make sure total sum is correct
    const catalogTotalQuantity = catalogChargeItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0,
    )
    expect(catalogTotalQuantity).toBe(
      chargeItems[0].quantity + chargeItems[1].quantity,
    )
  })

  it('Should throw when payment exists and status is in progress.', async () => {
    const performingOrganizationID = '1'
    const chargeItems = [{ code: 'asdf' }, { code: 'asdf' }]

    jest.spyOn(fjsClient, 'getChargeStatus').mockResolvedValueOnce({
      statusResult: {
        docuNum: '1',
        status: ChargeStatusResultStatusEnum.InProgress,
      },
      error: {
        code: 200,
        message: '1',
      },
    })

    const catalogChargeItems = await service.findCatalogChargeItems(
      performingOrganizationID,
      chargeItems,
    )

    const payment = await service.createPaymentModel(
      catalogChargeItems,
      applicationId,
      performingOrganizationID,
    )

    await expect(
      service.createCharge(
        user,
        performingOrganizationID,
        chargeItems,
        applicationId,
        undefined,
      ),
    ).rejects.toThrow()
  })

  it('Should continue with a payment that exists and status with an unpaid status.', async () => {
    const performingOrganizationID = '1'
    const chargeItems = [{ code: 'asdf' }, { code: 'asdf' }]

    const mock = jest.spyOn(fjsClient, 'getChargeStatus')

    mock.mockImplementation(() =>
      Promise.resolve({
        statusResult: {
          docuNum: '1',
          status: ChargeStatusResultStatusEnum.Unpaid,
        },
        error: {
          code: 200,
          message: '1',
        },
      }),
    )

    const catalogChargeItems = await service.findCatalogChargeItems(
      performingOrganizationID,
      chargeItems,
    )

    const payment = await service.createPaymentModel(
      catalogChargeItems,
      applicationId,
      performingOrganizationID,
    )

    const charge = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItems,
      applicationId,
      undefined,
    )

    expect(charge).toBeTruthy()
  })

  it('Should not create a new charge and a payment when payment exists', async () => {
    const performingOrganizationID = '1'
    const chargeItems = [{ code: 'asdf' }, { code: 'asdf' }]

    const mock = jest.spyOn(fjsClient, 'getChargeStatus')
    const createChargeSpy = jest.spyOn(fjsClient, 'createCharge')

    mock.mockImplementation(() =>
      Promise.resolve({
        statusResult: {
          docuNum: '1',
          status: ChargeStatusResultStatusEnum.Unpaid,
        },
        error: {
          code: 200,
          message: '1',
        },
      }),
    )

    const catalogChargeItems = await service.findCatalogChargeItems(
      performingOrganizationID,
      chargeItems,
    )

    const payment = await service.createPaymentModel(
      catalogChargeItems,
      applicationId,
      performingOrganizationID,
    )

    const charge = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItems,
      applicationId,
      undefined,
    )

    //Create charge exists so dont call it again.
    expect(createChargeSpy).not.toHaveBeenCalled()
    // Create charge uses the same payment model as we created above and does not creata a new one.
    expect(charge.id).toBe(payment.id)
  })
})
