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
    const chargeItemCodes: string[] = ['asdf']

    const result = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItemCodes,
      applicationId,
      undefined,
    )

    expect(result).toBeTruthy()
  })

  it('should create a charge with multiple charge items', async () => {
    const performingOrganizationID = '1'
    const chargeItemCodes: string[] = ['asdf', 'asdf']

    const result = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItemCodes,
      applicationId,
      undefined,
    )

    expect(result).toBeTruthy()
  })

  it('should throw an error when charge item is not found', async () => {
    const performingOrganizationID = '1'
    const chargeItemCodes: string[] = ['13']

    await expect(
      service.createCharge(
        user,
        performingOrganizationID,
        chargeItemCodes,
        applicationId,
        undefined,
      ),
    ).rejects.toThrow()
  })

  it('should get a payment status', async () => {
    const performingOrganizationID = '1'
    const chargeItemCodes: string[] = ['asdf', 'asdf']

    const charge = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItemCodes,
      applicationId,
      undefined,
    )

    const result = await service.getStatus(user, applicationId)
    expect(result.fulfilled).toBe(false)
  })

  it('should get a fulfilled payment status', async () => {
    const performingOrganizationID = '1'
    const chargeItemCodes: string[] = ['asdf', 'asdf']

    const charge = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItemCodes,
      applicationId,
      undefined,
    )

    await service.fulfillPayment(
      charge.id,
      faker.datatype.uuid(),
      applicationId,
    )
    const result = await service.getStatus(user, applicationId)
    expect(result.fulfilled).toBe(true)
  })

  it('Should throw when payment exists and status is in progress.', async () => {
    const performingOrganizationID = '1'
    const chargeItemCodes: string[] = ['asdf', 'asdf']

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

    const chargeItems = await service.findChargeItems(
      performingOrganizationID,
      chargeItemCodes,
    )

    const payment = await service.createPaymentModel(
      chargeItems,
      applicationId,
      performingOrganizationID,
    )

    await expect(
      service.createCharge(
        user,
        performingOrganizationID,
        chargeItemCodes,
        applicationId,
        undefined,
      ),
    ).rejects.toThrow()
  })

  it('Should continue with a payment that exists and status with an unpaid status.', async () => {
    const performingOrganizationID = '1'
    const chargeItemCodes: string[] = ['asdf', 'asdf']

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

    const chargeItems = await service.findChargeItems(
      performingOrganizationID,
      chargeItemCodes,
    )

    const payment = await service.createPaymentModel(
      chargeItems,
      applicationId,
      performingOrganizationID,
    )

    const charge = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItemCodes,
      applicationId,
      undefined,
    )

    expect(charge).toBeTruthy()
  })

  it('Should not create a new charge and a payment when payment exists', async () => {
    const performingOrganizationID = '1'
    const chargeItemCodes: string[] = ['asdf', 'asdf']

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

    const chargeItems = await service.findChargeItems(
      performingOrganizationID,
      chargeItemCodes,
    )

    const payment = await service.createPaymentModel(
      chargeItems,
      applicationId,
      performingOrganizationID,
    )

    const charge = await service.createCharge(
      user,
      performingOrganizationID,
      chargeItemCodes,
      applicationId,
      undefined,
    )

    //Create charge exists so dont call it again.
    expect(createChargeSpy).not.toHaveBeenCalled()
    // Create charge uses the same payment model as we created above and does not creata a new one.
    expect(charge.id).toBe(payment.id)
  })
})
