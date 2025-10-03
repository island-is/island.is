import { BadRequestException } from '@nestjs/common'

import { TestApp } from '@island.is/testing/nest'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { PaymentServiceCode } from '@island.is/shared/constants'

import { setupTestApp } from '../../../test/setup'
import { PaymentMethod, PaymentStatus } from '../../types'

import { PaymentFlowService } from './paymentFlow.service'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'
import { PaymentFlow } from './models/paymentFlow.model'
import { getModelToken } from '@nestjs/sequelize'

// A helper type to satisfy the linter for partial mocks.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TestPartial = any

describe('PaymentFlowService', () => {
  let app: TestApp
  let service: PaymentFlowService

  beforeAll(async () => {
    app = await setupTestApp()

    service = app.get<PaymentFlowService>(PaymentFlowService)

    const chargeFjsService = app.get<ChargeFjsV2ClientService>(
      ChargeFjsV2ClientService,
    )

    jest
      .spyOn(chargeFjsService, 'validateCharge')
      .mockReturnValue(Promise.resolve(true))
  })

  afterAll(() => {
    app?.cleanUp()

    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('createPaymentFlow', () => {
    it('should create flow', async () => {
      const charges = [
        {
          chargeItemCode: '123',
          chargeType: 'A',
          quantity: 1,
          price: 100,
        },
      ]

      jest
        .spyOn(service as TestPartial, 'getPaymentFlowChargeDetails')
        .mockReturnValue(
          Promise.resolve({
            catalogItems: charges,
            totalPrice: 0,
            isAlreadyPaid: false,
            hasInvoice: false,
          }),
        )

      const paymentInfo: CreatePaymentFlowInput = {
        availablePaymentMethods: [PaymentMethod.CARD],
        charges,
        payerNationalId: '1234567890',
        onUpdateUrl: 'http://localhost:3333/update',
        organisationId: '5534567890',
      }

      const result = await service.createPaymentUrl(paymentInfo)

      expect(result.urls).toBeDefined()
    })
  })

  describe('deletePaymentFlow', () => {
    const paymentFlowId = 'test-id'
    const mockPayer = {
      payerNationalId: '1234567890',
      name: 'Tester Testsson',
    }
    const mockPaymentFlowDetails = {
      id: paymentFlowId,
      organisationId: '5534567890',
      payerNationalId: mockPayer.payerNationalId,
      charges: [],
      availablePaymentMethods: [PaymentMethod.CARD],
      onUpdateUrl: 'http://some.url/update',
    }

    let paymentFlowModel: typeof PaymentFlow

    beforeAll(() => {
      paymentFlowModel = app.get<typeof PaymentFlow>(getModelToken(PaymentFlow))
    })

    beforeEach(() => {
      jest.restoreAllMocks()
    })

    it('should throw a not found error if flow does not exist', async () => {
      const error = new BadRequestException(
        PaymentServiceCode.PaymentFlowNotFound,
      )
      jest.spyOn(service, 'getPaymentFlowDetails').mockRejectedValue(error)

      const promise = service.deletePaymentFlow(paymentFlowId)
      await expect(promise).rejects.toThrow(error)

      expect(service.getPaymentFlowDetails).toHaveBeenCalledWith(paymentFlowId)
    })

    it('should throw an already paid error if flow is paid', async () => {
      jest
        .spyOn(service, 'getPaymentFlowDetails')
        .mockResolvedValue(mockPaymentFlowDetails as TestPartial)
      jest.spyOn(service, 'getPaymentFlowStatus').mockResolvedValue({
        paymentStatus: PaymentStatus.PAID,
        updatedAt: new Date(),
      })

      const error = new BadRequestException(
        PaymentServiceCode.PaymentFlowAlreadyPaid,
      )

      const promise = service.deletePaymentFlow(paymentFlowId)
      await expect(promise).rejects.toThrow(error)

      expect(service.getPaymentFlowDetails).toHaveBeenCalledWith(paymentFlowId)
      expect(service.getPaymentFlowStatus).toHaveBeenCalledWith(
        mockPaymentFlowDetails,
      )
    })

    it('should delete a flow with a pending invoice', async () => {
      const paymentFlowWithInvoice = {
        ...mockPaymentFlowDetails,
        fjsCharge: { id: 'fjs-confirm' },
      }

      jest
        .spyOn(service, 'getPaymentFlowDetails')
        .mockResolvedValue(paymentFlowWithInvoice as TestPartial)
      jest.spyOn(service, 'getPaymentFlowStatus').mockResolvedValue({
        paymentStatus: PaymentStatus.INVOICE_PENDING,
        updatedAt: new Date(),
      })
      jest.spyOn(service, 'getPaymentFlowChargeDetails').mockResolvedValue({
        firstProductTitle: 'Test Product',
        totalPrice: 100,
      } as TestPartial)
      jest
        .spyOn(service as TestPartial, 'getPayerName')
        .mockResolvedValue(mockPayer.name)
      jest.spyOn(service, 'logPaymentFlowUpdate').mockResolvedValue(undefined)
      const deleteFjsChargeSpy = jest
        .spyOn(service, 'deleteFjsCharge')
        .mockResolvedValue(undefined)

      const destroySpy = jest
        .spyOn(paymentFlowModel, 'destroy')
        .mockResolvedValue(1)

      const result = await service.deletePaymentFlow(paymentFlowId)

      expect(result).toBeDefined()
      expect(result.paymentStatus).toBe(PaymentStatus.INVOICE_PENDING)
      expect(service.getPaymentFlowDetails).toHaveBeenCalledWith(paymentFlowId)
      expect(deleteFjsChargeSpy).toHaveBeenCalledWith(paymentFlowId)
      expect(destroySpy).toHaveBeenCalledWith({ where: { id: paymentFlowId } })
      expect(service.logPaymentFlowUpdate).toHaveBeenCalled()
    })

    it('should delete a flow that is unpaid and has no invoice', async () => {
      const paymentFlowWithoutInvoice = {
        ...mockPaymentFlowDetails,
        fjsCharge: null,
      }

      jest
        .spyOn(service, 'getPaymentFlowDetails')
        .mockResolvedValue(paymentFlowWithoutInvoice as TestPartial)
      jest.spyOn(service, 'getPaymentFlowStatus').mockResolvedValue({
        paymentStatus: PaymentStatus.UNPAID,
        updatedAt: new Date(),
      })
      jest.spyOn(service, 'getPaymentFlowChargeDetails').mockResolvedValue({
        firstProductTitle: 'Test Product',
        totalPrice: 100,
      } as TestPartial)
      jest
        .spyOn(service as TestPartial, 'getPayerName')
        .mockResolvedValue(mockPayer.name)
      jest.spyOn(service, 'logPaymentFlowUpdate').mockResolvedValue(undefined)
      const deleteFjsChargeSpy = jest
        .spyOn(service, 'deleteFjsCharge')
        .mockResolvedValue(undefined)

      const destroySpy = jest
        .spyOn(paymentFlowModel, 'destroy')
        .mockResolvedValue(1)

      const result = await service.deletePaymentFlow(paymentFlowId)

      expect(result).toBeDefined()
      expect(result.paymentStatus).toBe(PaymentStatus.UNPAID)
      expect(service.getPaymentFlowDetails).toHaveBeenCalledWith(paymentFlowId)
      expect(deleteFjsChargeSpy).not.toHaveBeenCalled()
      expect(destroySpy).toHaveBeenCalledWith({ where: { id: paymentFlowId } })
      expect(service.logPaymentFlowUpdate).toHaveBeenCalled()
    })

    it('should not send notification if onUpdateUrl is missing', async () => {
      const paymentFlowWithoutUrl = {
        ...mockPaymentFlowDetails,
        onUpdateUrl: null,
        fjsCharge: null,
      }

      jest
        .spyOn(service, 'getPaymentFlowDetails')
        .mockResolvedValue(paymentFlowWithoutUrl as TestPartial)
      jest.spyOn(service, 'getPaymentFlowStatus').mockResolvedValue({
        paymentStatus: PaymentStatus.UNPAID,
        updatedAt: new Date(),
      })
      jest.spyOn(service, 'getPaymentFlowChargeDetails').mockResolvedValue({
        firstProductTitle: 'Test Product',
        totalPrice: 100,
      } as TestPartial)
      jest
        .spyOn(service as TestPartial, 'getPayerName')
        .mockResolvedValue(mockPayer.name)
      const logSpy = jest
        .spyOn(service, 'logPaymentFlowUpdate')
        .mockResolvedValue(undefined)

      const destroySpy = jest
        .spyOn(paymentFlowModel, 'destroy')
        .mockResolvedValue(1)

      await service.deletePaymentFlow(paymentFlowId)

      expect(logSpy).not.toHaveBeenCalled()
      expect(destroySpy).toHaveBeenCalledWith({ where: { id: paymentFlowId } })
    })
  })
})
