import { BadRequestException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'

import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { FjsErrorCode, PaymentServiceCode } from '@island.is/shared/constants'
import { TestApp } from '@island.is/testing/nest'
import { v4 as uuid } from 'uuid'

import { setupTestApp } from '../../../test/setup'
import { PaymentMethod, PaymentStatus } from '../../types'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'
import { FjsCharge } from './models/fjsCharge.model'
import { PaymentFlow } from './models/paymentFlow.model'
import { PaymentFulfillment } from './models/paymentFulfillment.model'
import { PaymentFlowService } from './paymentFlow.service'

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
          reference: 'charge-ref-xyz',
          paymentOptions: ['CARD', 'CLAIM'],
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

      const paymentFlowModel = (service as TestPartial).paymentFlowModel
      const updateSpy = jest
        .spyOn(paymentFlowModel, 'update')
        .mockImplementation(() =>
          Promise.resolve([1, []] as [number, unknown[]]),
        )

      const result = await service.deletePaymentFlow(paymentFlowId)

      expect(result).toBeDefined()
      expect(result.paymentStatus).toBe(PaymentStatus.INVOICE_PENDING)
      expect(service.getPaymentFlowDetails).toHaveBeenCalledWith(paymentFlowId)
      expect(deleteFjsChargeSpy).toHaveBeenCalledWith(paymentFlowId)
      expect(updateSpy).toHaveBeenCalledWith(
        { isDeleted: true },
        { where: { id: paymentFlowId, isDeleted: false } },
      )
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

      const paymentFlowModel = (service as TestPartial).paymentFlowModel
      const updateSpy = jest
        .spyOn(paymentFlowModel, 'update')
        .mockImplementation(() =>
          Promise.resolve([1, []] as [number, unknown[]]),
        )

      const result = await service.deletePaymentFlow(paymentFlowId)

      expect(result).toBeDefined()
      expect(result.paymentStatus).toBe(PaymentStatus.UNPAID)
      expect(service.getPaymentFlowDetails).toHaveBeenCalledWith(paymentFlowId)
      expect(deleteFjsChargeSpy).not.toHaveBeenCalled()
      expect(updateSpy).toHaveBeenCalledWith(
        { isDeleted: true },
        { where: { id: paymentFlowId, isDeleted: false } },
      )
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

      const paymentFlowModel = (service as TestPartial).paymentFlowModel
      const updateSpy = jest
        .spyOn(paymentFlowModel, 'update')
        .mockImplementation(() =>
          Promise.resolve([1, []] as [number, unknown[]]),
        )

      await service.deletePaymentFlow(paymentFlowId)

      expect(logSpy).not.toHaveBeenCalled()
      expect(updateSpy).toHaveBeenCalledWith(
        { isDeleted: true },
        { where: { id: paymentFlowId, isDeleted: false } },
      )
    })
  })

  describe('createInvoicePaymentConfirmation', () => {
    it('should throw PaymentFlowNotFound when charge is not found (e.g. flow soft-deleted)', async () => {
      const paymentFlowId = uuid()
      const receptionId = `reception-${uuid()}`

      const fjsChargeModel = (service as TestPartial).fjsChargeModel
      jest.spyOn(fjsChargeModel, 'findOne').mockResolvedValue(null)

      await expect(
        service.createInvoicePaymentConfirmation(paymentFlowId, receptionId),
      ).rejects.toMatchObject({
        response: { message: PaymentServiceCode.PaymentFlowNotFound },
      })

      expect(fjsChargeModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            paymentFlowId,
            receptionId,
            isDeleted: false,
          },
          include: [
            {
              model: PaymentFlow,
              where: { isDeleted: false },
              required: true,
              attributes: [],
            },
          ],
        }),
      )
    })

    it('should throw PaymentFlowNotFound when payment flow is soft-deleted (real DB query)', async () => {
      const paymentFlowModel = app.get<typeof PaymentFlow>(
        getModelToken(PaymentFlow),
      )
      const fjsChargeModel = app.get<typeof FjsCharge>(getModelToken(FjsCharge))

      const paymentFlowId = uuid()
      const receptionId = `reception-${uuid()}`

      await paymentFlowModel.create({
        id: paymentFlowId,
        payerNationalId: '1234567890',
        availablePaymentMethods: [PaymentMethod.CARD, PaymentMethod.INVOICE],
        organisationId: '5534567890',
      } as TestPartial)

      await fjsChargeModel.create({
        paymentFlowId,
        receptionId,
        user4: 'user4-value',
        status: 'unpaid',
      })

      await paymentFlowModel.update(
        { isDeleted: true },
        { where: { id: paymentFlowId } },
      )

      await expect(
        service.createInvoicePaymentConfirmation(paymentFlowId, receptionId),
      ).rejects.toMatchObject({
        response: { message: PaymentServiceCode.PaymentFlowNotFound },
      })
    })
  })

  describe('createBankTransferFulfillment', () => {
    const dummyCharge = {} as TestPartial

    const createFlow = async (paymentFlowId: string) => {
      const paymentFlowModel = app.get<typeof PaymentFlow>(
        getModelToken(PaymentFlow),
      )
      await paymentFlowModel.create({
        id: paymentFlowId,
        payerNationalId: '1234567890',
        availablePaymentMethods: [PaymentMethod.CARD],
        organisationId: '5534567890',
      } as TestPartial)
    }

    const fulfillmentCount = (paymentFlowId: string) =>
      app
        .get<typeof PaymentFulfillment>(getModelToken(PaymentFulfillment))
        .count({ where: { paymentFlowId, isDeleted: false } })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('creates the fulfillment on the first call and no-ops on a re-verify', async () => {
      const paymentFlowId = uuid()
      await createFlow(paymentFlowId)
      // Mock the FJS call so this test doesn't depend on the FJS HTTP backend.
      jest
        .spyOn(service, 'createFjsCharge')
        .mockResolvedValue({ receptionId: 'r-1' } as TestPartial)

      await service.createBankTransferFulfillment(
        paymentFlowId,
        uuid(),
        dummyCharge,
      )
      // A re-verify of the same flow must not create a second fulfillment.
      await service.createBankTransferFulfillment(
        paymentFlowId,
        uuid(),
        dummyCharge,
      )

      expect(await fulfillmentCount(paymentFlowId)).toBe(1)
    })

    it('treats a unique-constraint race as a no-op (no throw)', async () => {
      const model = (service as TestPartial).paymentFulfillmentModel
      jest.spyOn(model, 'findOne').mockResolvedValue(null)
      jest.spyOn(model, 'create').mockRejectedValue(
        Object.assign(new Error('duplicate key'), {
          name: 'SequelizeUniqueConstraintError',
        }),
      )

      await expect(
        service.createBankTransferFulfillment(uuid(), uuid(), dummyCharge),
      ).resolves.toBeUndefined()
    })

    it('rethrows non-uniqueness errors', async () => {
      const model = (service as TestPartial).paymentFulfillmentModel
      jest.spyOn(model, 'findOne').mockResolvedValue(null)
      jest
        .spyOn(model, 'create')
        .mockRejectedValue(new Error('connection reset'))

      await expect(
        service.createBankTransferFulfillment(uuid(), uuid(), dummyCharge),
      ).rejects.toThrow('connection reset')
    })

    it('creates the FJS charge once on the first payment when a payload is given', async () => {
      const paymentFlowId = uuid()
      await createFlow(paymentFlowId)
      const createFjsChargeSpy = jest
        .spyOn(service, 'createFjsCharge')
        .mockResolvedValue({ receptionId: 'r-1' } as TestPartial)

      await service.createBankTransferFulfillment(
        paymentFlowId,
        uuid(),
        dummyCharge,
      )

      expect(createFjsChargeSpy).toHaveBeenCalledTimes(1)
      expect(createFjsChargeSpy).toHaveBeenCalledWith(paymentFlowId, dummyCharge)
    })

    it('retries then keeps the fulfillment when the FJS charge keeps failing', async () => {
      const paymentFlowId = uuid()
      await createFlow(paymentFlowId)
      jest
        .spyOn(service, 'createFjsCharge')
        .mockRejectedValue(new Error('FJS down'))

      // The transfer already settled, so a failed FJS charge must not throw or un-pay the flow.
      await expect(
        service.createBankTransferFulfillment(paymentFlowId, uuid(), dummyCharge),
      ).resolves.toBeUndefined()

      expect(service.createFjsCharge).toHaveBeenCalledTimes(3)
      expect(await fulfillmentCount(paymentFlowId)).toBe(1)
    })

    it('does not retry the FJS charge when it already exists', async () => {
      const paymentFlowId = uuid()
      await createFlow(paymentFlowId)
      jest
        .spyOn(service, 'createFjsCharge')
        .mockRejectedValue(new Error(FjsErrorCode.AlreadyCreatedCharge))

      await service.createBankTransferFulfillment(
        paymentFlowId,
        uuid(),
        dummyCharge,
      )

      expect(service.createFjsCharge).toHaveBeenCalledTimes(1)
    })
  })

  describe('findPaidFlowsWithoutFjsCharge — bank transfer exclusion', () => {
    it('does not return a paid bank_transfer flow (no worker backfill for transfers)', async () => {
      const paymentFlowModel = app.get<typeof PaymentFlow>(
        getModelToken(PaymentFlow),
      )
      const paymentFulfillmentModel = app.get<typeof PaymentFulfillment>(
        getModelToken(PaymentFulfillment),
      )
      const paymentFlowId = uuid()

      await paymentFlowModel.create({
        id: paymentFlowId,
        payerNationalId: '1234567890',
        availablePaymentMethods: [PaymentMethod.CARD],
        organisationId: '5534567890',
      } as TestPartial)

      // A paid bank_transfer flow: fulfillment present, no FJS charge, no card details.
      await paymentFulfillmentModel.create({
        paymentFlowId,
        paymentMethod: 'bank_transfer',
        confirmationRefId: uuid(),
      } as TestPartial)

      const result = await service.findPaidFlowsWithoutFjsCharge(
        new Date(Date.now() + 60_000),
      )

      expect(result.map((flow) => flow.id)).not.toContain(paymentFlowId)
    })
  })
})
