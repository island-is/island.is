import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  PaymentService,
  PaymentMethod,
  PaymentModuleConfig,
} from '@island.is/application/api/payment'
import { PaymentsApi } from '@island.is/clients/payments'
import { ApplicationTypes } from '@island.is/application/types'
import { createApplication } from '@island.is/application/testing'
import { ApplicationChargeService } from './application-charge.service'

describe('ApplicationChargeService', () => {
  let service: ApplicationChargeService
  let mockPaymentService: {
    findPaymentsByApplicationIds: jest.Mock
  }

  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    child: jest.fn(),
  }

  const mockConfig = {
    clientLocationOrigin: 'https://island.is',
  }

  beforeEach(async () => {
    mockLogger.child.mockReturnValue(mockLogger)

    mockPaymentService = {
      findPaymentsByApplicationIds: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationChargeService,
        { provide: LOGGER_PROVIDER, useValue: mockLogger },
        { provide: PaymentService, useValue: mockPaymentService },
        { provide: PaymentsApi, useValue: {} },
        { provide: PaymentModuleConfig.KEY, useValue: mockConfig },
      ],
    }).compile()

    service = module.get<ApplicationChargeService>(ApplicationChargeService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getApplicationLink', () => {
    it('should return a link with slug and application id', async () => {
      const application = createApplication({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })

      const link = await service.getApplicationLink(application)

      expect(link).toBe(
        `https://island.is/umsoknir/example-common-actions/${application.id}`,
      )
    })

    it('should throw NotFoundException when typeId is missing', async () => {
      const application = createApplication({
        typeId: undefined as unknown as ApplicationTypes,
      })

      await expect(service.getApplicationLink(application)).rejects.toThrow(
        new NotFoundException(
          `application type id was not found for application id ${application.id}`,
        ),
      )
    })
  })

  describe('getInvoicePaymentApplicationIds', () => {
    it('should return an empty set when no application ids are provided', async () => {
      const result = await service.getInvoicePaymentApplicationIds([])

      expect(result).toEqual(new Set())
      expect(
        mockPaymentService.findPaymentsByApplicationIds,
      ).not.toHaveBeenCalled()
    })

    it('should return only application ids with invoice payments', async () => {
      const invoiceAppId = 'invoice-app-id'
      const cardAppId = 'card-app-id'
      const applicationIds = [invoiceAppId, cardAppId, 'no-payment-app-id']

      mockPaymentService.findPaymentsByApplicationIds.mockResolvedValue([
        {
          application_id: invoiceAppId,
          payment_method: PaymentMethod.INVOICE,
        },
        {
          application_id: cardAppId,
          payment_method: PaymentMethod.CARD,
        },
      ])

      const result = await service.getInvoicePaymentApplicationIds(
        applicationIds,
      )

      expect(
        mockPaymentService.findPaymentsByApplicationIds,
      ).toHaveBeenCalledWith(applicationIds)
      expect(result).toEqual(new Set([invoiceAppId]))
    })

    it('should deduplicate invoice application ids', async () => {
      const applicationId = 'invoice-app-id'

      mockPaymentService.findPaymentsByApplicationIds.mockResolvedValue([
        {
          application_id: applicationId,
          payment_method: PaymentMethod.INVOICE,
        },
        {
          application_id: applicationId,
          payment_method: PaymentMethod.INVOICE,
        },
      ])

      const result = await service.getInvoicePaymentApplicationIds([
        applicationId,
      ])

      expect(result).toEqual(new Set([applicationId]))
    })
  })
})
