import { Test, TestingModule } from '@nestjs/testing'
import { mock } from 'jest-mock-extended'
import { PaymentService } from './payment.service'
import { Payment } from './payment.model'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { AuditService } from '@island.is/nest/audit'
import { ApplicationService } from '@island.is/application/api/core'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { DefaultApi } from '@island.is/clients/charge-fjs-v2'

class MockChargeFjsV2ClientService extends ChargeFjsV2ClientService {
  api: jest.Mocked<DefaultApi>

  constructor() {
    super({} as any) // As we're mocking, we can pass anything here
    this.api = {
      chargeStatusByRequestIDrequestIDGET4: jest.fn(),
      chargerequestIDDELETE2: jest.fn(),
      chargePOST1: jest.fn(),
      catalogperformingOrgperformingOrgIDGET3: jest.fn(),
    }
  }
}

describe('PaymentService', () => {
  let service: PaymentService
  const genericLogger = mock<Logger>()
  let mockChargeService: jest.Mocked<ChargeFjsV2ClientService>

  beforeEach(async () => {
    mockChargeService = {
      pgetChargeStatus: jest.fn(),
      deleteCharge: jest.fn(),
      createCharge: jest.fn(),
      getCatalogByPerformingOrg: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: 'PaymentModel', useValue: {} }, // replace with suitable mock
        { provide: 'PaymentModuleConfig.KEY', useValue: {} }, // replace with suitable mock
        { provide: ChargeFjsV2ClientService, useValue: {} }, // replace with suitable mock
        { provide: AuditService, useValue: {} }, // replace with suitable mock
        { provide: ApplicationService, useValue: {} }, // replace with suitable mock
        {
          provide: LOGGER_PROVIDER,
          useValue: genericLogger,
        },
      ],
    }).compile()

    service = module.get<PaymentService>(PaymentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findPaymentByApplicationId', () => {
    it('should return a payment', async () => {
      const paymentModelMock = {
        findOne: jest.fn().mockResolvedValue(new Payment()),
      } // replace with suitable mock
      service.paymentModel = paymentModelMock
      const applicationId = 'test'
      const payment = await service.findPaymentByApplicationId(applicationId)
      expect(payment).toBeInstanceOf(Payment)
      expect(paymentModelMock.findOne).toHaveBeenCalledWith({
        where: { application_id: applicationId },
      })
    })
  })

  // Continue with the rest of the methods
})
