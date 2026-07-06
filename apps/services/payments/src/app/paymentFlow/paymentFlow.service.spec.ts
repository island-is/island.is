import { BadRequestException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'

import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { PaymentServiceCode } from '@island.is/shared/constants'
import { TestApp } from '@island.is/testing/nest'
import { v4 as uuid } from 'uuid'

import { setupTestApp } from '../../../test/setup'
import {
  CatalogItemWithQuantity,
  PaymentMethod,
  PaymentStatus,
} from '../../types'
import { BankTransferPayment } from '../bankTransferPayment/models/bankTransferPayment.model'
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
  let featureFlagService: FeatureFlagService

  beforeAll(async () => {
    app = await setupTestApp()

    service = app.get<PaymentFlowService>(PaymentFlowService)

    const chargeFjsService = app.get<ChargeFjsV2ClientService>(
      ChargeFjsV2ClientService,
    )

    jest
      .spyOn(chargeFjsService, 'validateCharge')
      .mockReturnValue(Promise.resolve(true))

    // Bank transfer availability is gated behind the global feature flag; default
    // it on so the individuals-only tests exercise the kennitala gate. The
    // flag-off case is asserted explicitly below.
    featureFlagService = app.get<FeatureFlagService>(FeatureFlagService)
    jest.spyOn(featureFlagService, 'getValue').mockResolvedValue(true as never)
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

    const bankTransferCharges = [
      {
        chargeItemCode: '123',
        chargeType: 'A',
        quantity: 1,
        price: 100,
        reference: 'charge-ref-xyz',
        paymentOptions: ['CARD', 'TRANSFER'],
      },
    ]

    const createFlowAndReadMethods = async (payerNationalId: string) => {
      jest.spyOn(service, 'getPaymentFlowChargeDetails').mockResolvedValue({
        firstProductTitle: 'Test product',
        totalPrice: 0,
        catalogItems:
          bankTransferCharges as unknown as CatalogItemWithQuantity[],
      })

      const paymentFlowModel = app.get<typeof PaymentFlow>(
        getModelToken(PaymentFlow),
      )

      const { id } = await service.createPaymentUrl({
        charges: bankTransferCharges,
        payerNationalId,
        onUpdateUrl: 'http://localhost:3333/update',
        organisationId: '5534567890',
      })

      const created = await paymentFlowModel.findByPk(id)
      return created?.availablePaymentMethods
    }

    it('should offer bank transfer to an individual payer', async () => {
      const methods = await createFlowAndReadMethods('0101302129') // valid person kennitala

      expect(methods).toEqual([PaymentMethod.CARD, PaymentMethod.BANK_TRANSFER])
    })

    it('should not offer bank transfer to a company payer', async () => {
      const methods = await createFlowAndReadMethods('6010100890') // valid company kennitala

      expect(methods).toEqual([PaymentMethod.CARD])
    })

    it('should not offer bank transfer to a temporary kennitala payer', async () => {
      const methods = await createFlowAndReadMethods('8123456789') // temporary kennitala (starts with 8)

      expect(methods).toEqual([PaymentMethod.CARD])
    })

    it('should not offer bank transfer to an individual when the feature flag is off', async () => {
      jest
        .spyOn(featureFlagService, 'getValue')
        .mockResolvedValueOnce(false as never)

      const methods = await createFlowAndReadMethods('0101302129') // valid person kennitala

      expect(methods).toEqual([PaymentMethod.CARD])
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
      // Admin flow deletion is best-effort cleanup, so it opts out of the throw-by-default.
      expect(deleteFjsChargeSpy).toHaveBeenCalledWith(paymentFlowId, {
        throwOnError: false,
      })
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

  describe('findPaidFlowsWithoutFjsCharge — bank transfer backfill', () => {
    it('returns a paid bank_transfer flow with its bank transfer payments eager-loaded', async () => {
      const paymentFlowModel = app.get<typeof PaymentFlow>(
        getModelToken(PaymentFlow),
      )
      const paymentFulfillmentModel = app.get<typeof PaymentFulfillment>(
        getModelToken(PaymentFulfillment),
      )
      const bankTransferPaymentModel = app.get<typeof BankTransferPayment>(
        getModelToken(BankTransferPayment),
      )
      const paymentFlowId = uuid()
      const bankTransferPaymentId = uuid()

      await paymentFlowModel.create({
        id: paymentFlowId,
        payerNationalId: '1234567890',
        availablePaymentMethods: [PaymentMethod.CARD],
        organisationId: '5534567890',
      } as TestPartial)

      // The settled bank transfer row; the fulfillment references it via confirmationRefId.
      await bankTransferPaymentModel.create({
        id: bankTransferPaymentId,
        paymentFlowId,
        provider: 'test-provider',
        providerPaymentId: 'provider-payment-id',
        sourceReferenceId: bankTransferPaymentId,
        amount: 900,
        lastKnownStatus: 'Success',
        expiresAt: new Date(Date.now() + 60_000),
      })

      // A paid bank_transfer flow: fulfillment present, no FJS charge, no card details.
      await paymentFulfillmentModel.create({
        paymentFlowId,
        paymentMethod: 'bank_transfer',
        confirmationRefId: bankTransferPaymentId,
      } as TestPartial)

      const result = await service.findPaidFlowsWithoutFjsCharge(
        new Date(Date.now() + 60_000),
      )

      const flow = result.find((f) => f.id === paymentFlowId)
      expect(flow).toBeDefined()
      // The worker rebuilds the PAID charge from this include — assert the real
      // association wiring, not just that the flow is returned.
      expect(flow?.bankTransferPayments).toHaveLength(1)
      expect(flow?.bankTransferPayments?.[0]).toMatchObject({
        id: bankTransferPaymentId,
        providerPaymentId: 'provider-payment-id',
        amount: 900,
      })
    })
  })

  describe('createFjsCharge — AlreadyCreatedCharge reconcile', () => {
    // FJS message that maps to FjsErrorCode.AlreadyCreatedCharge.
    const alreadyCreatedError = new Error('Búið að taka á móti álagningu')

    const chargePayloadWithPayInfo = (paymentFlowId: string) =>
      ({
        requestID: paymentFlowId,
        payInfo: {
          RRN: paymentFlowId,
          paymentMeans: 'Milli',
          payableAmount: 1000,
        },
      } as TestPartial)

    it('adopts the existing local FJS charge row and links it to the fulfillment instead of failing', async () => {
      const paymentFlowModel = app.get<typeof PaymentFlow>(
        getModelToken(PaymentFlow),
      )
      const paymentFulfillmentModel = app.get<typeof PaymentFulfillment>(
        getModelToken(PaymentFulfillment),
      )
      const fjsChargeModel = app.get<typeof FjsCharge>(getModelToken(FjsCharge))
      const chargeFjsService = app.get<ChargeFjsV2ClientService>(
        ChargeFjsV2ClientService,
      )

      const paymentFlowId = uuid()
      await paymentFlowModel.create({
        id: paymentFlowId,
        payerNationalId: '1234567890',
        availablePaymentMethods: [PaymentMethod.CARD],
        organisationId: '5534567890',
      } as TestPartial)
      // Settled fulfillment with no FJS charge link yet (the partial-failure state we recover from).
      await paymentFulfillmentModel.create({
        paymentFlowId,
        paymentMethod: 'bank_transfer',
        confirmationRefId: uuid(),
      } as TestPartial)

      // A prior test leaves fjsChargeModel.findOne mocked — restore so reconcile does a real lookup.
      jest.spyOn(fjsChargeModel, 'findOne').mockRestore()

      // A row WAS persisted on the prior attempt (carrying the real FJS reception id); only the
      // fulfillment/flow link is missing.
      const existingCharge = await fjsChargeModel.create({
        paymentFlowId,
        receptionId: 'recept-1',
        user4: 'doc-123',
        status: 'paid',
      } as TestPartial)

      jest
        .spyOn(chargeFjsService, 'createCharge')
        .mockRejectedValueOnce(alreadyCreatedError)

      const result = await service.createFjsCharge(
        paymentFlowId,
        chargePayloadWithPayInfo(paymentFlowId),
      )

      // The pre-existing charge is adopted and returned — its real reception id is preserved.
      expect(result).toBeDefined()
      expect(result.id).toBe(existingCharge.id)
      expect(result.receptionId).toBe('recept-1')

      // And the fulfillment is linked to it.
      const fulfillment = await paymentFulfillmentModel.findOne({
        where: { paymentFlowId, isDeleted: false },
      })
      expect(fulfillment?.fjsChargeId).toBe(existingCharge.id)
    })

    it('still throws when FJS reports the charge exists but no local row exists to reconcile', async () => {
      const paymentFlowModel = app.get<typeof PaymentFlow>(
        getModelToken(PaymentFlow),
      )
      const fjsChargeModel = app.get<typeof FjsCharge>(getModelToken(FjsCharge))
      const chargeFjsService = app.get<ChargeFjsV2ClientService>(
        ChargeFjsV2ClientService,
      )

      const paymentFlowId = uuid()
      await paymentFlowModel.create({
        id: paymentFlowId,
        payerNationalId: '1234567890',
        availablePaymentMethods: [PaymentMethod.CARD],
        organisationId: '5534567890',
      } as TestPartial)

      // No local fjs_charge row → reception id is unrecoverable → reconcile returns null.
      jest.spyOn(fjsChargeModel, 'findOne').mockRestore()

      jest
        .spyOn(chargeFjsService, 'createCharge')
        .mockRejectedValueOnce(alreadyCreatedError)

      await expect(
        service.createFjsCharge(
          paymentFlowId,
          chargePayloadWithPayInfo(paymentFlowId),
        ),
      ).rejects.toBeInstanceOf(BadRequestException)
    })
  })

  describe('deleteFjsCharge', () => {
    it('rethrows FJS deletion errors by default (refund must fail loudly)', async () => {
      const chargeFjsService = app.get<ChargeFjsV2ClientService>(
        ChargeFjsV2ClientService,
      )
      jest
        .spyOn(chargeFjsService, 'deleteCharge')
        .mockRejectedValueOnce(new Error('FJS down'))

      await expect(service.deleteFjsCharge(uuid())).rejects.toThrow('FJS down')
    })

    it('swallows the error when throwOnError is false (best-effort cleanup)', async () => {
      const chargeFjsService = app.get<ChargeFjsV2ClientService>(
        ChargeFjsV2ClientService,
      )
      jest
        .spyOn(chargeFjsService, 'deleteCharge')
        .mockRejectedValueOnce(new Error('FJS down'))

      await expect(
        service.deleteFjsCharge(uuid(), { throwOnError: false }),
      ).resolves.toBeUndefined()
    })

    it('does not throw when FJS deletion succeeds but the local update fails (refund already committed)', async () => {
      const chargeFjsService = app.get<ChargeFjsV2ClientService>(
        ChargeFjsV2ClientService,
      )
      jest
        .spyOn(chargeFjsService, 'deleteCharge')
        .mockResolvedValueOnce(undefined as never)
      const fjsChargeModel = app.get<typeof FjsCharge>(getModelToken(FjsCharge))
      jest
        .spyOn(fjsChargeModel, 'update')
        .mockRejectedValueOnce(new Error('db blip'))

      // Throwing here would roll the saga back and resurrect the PAID state — it must not throw,
      // even with the default throwOnError=true.
      await expect(service.deleteFjsCharge(uuid())).resolves.toBeUndefined()
    })

    it('treats an "already cancelled" FJS error as success and syncs local state', async () => {
      const chargeFjsService = app.get<ChargeFjsV2ClientService>(
        ChargeFjsV2ClientService,
      )
      // FJS reports the cancellation was already received — the charge is gone, so this is success.
      jest
        .spyOn(chargeFjsService, 'deleteCharge')
        .mockRejectedValueOnce(
          new Error('Búið að taka á móti niðurfellingu á álagningu'),
        )
      const fjsChargeModel = app.get<typeof FjsCharge>(getModelToken(FjsCharge))
      const updateSpy = jest.spyOn(fjsChargeModel, 'update')

      const paymentFlowId = uuid()
      await expect(
        service.deleteFjsCharge(paymentFlowId),
      ).resolves.toBeUndefined()

      // Local record is still marked deleted even though the FJS call threw.
      expect(updateSpy).toHaveBeenCalledWith(
        { isDeleted: true },
        { where: { paymentFlowId, isDeleted: false } },
      )
    })
  })
})
