import { BadRequestException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'

import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
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
        'bank_transfer',
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

      // The sweeps are per-method: the card sweep must not pick up this flow.
      const cardResult = await service.findPaidFlowsWithoutFjsCharge(
        new Date(Date.now() + 60_000),
        'card',
      )
      expect(cardResult.find((f) => f.id === paymentFlowId)).toBeUndefined()
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

    it('adopts the winner and logs the orphaned reception id when the local insert loses the unique-index race', async () => {
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
      const logger = app.get<Logger>(LOGGER_PROVIDER)

      const paymentFlowId = uuid()
      await paymentFlowModel.create({
        id: paymentFlowId,
        payerNationalId: '1234567890',
        availablePaymentMethods: [PaymentMethod.CARD],
        organisationId: '5534567890',
      } as TestPartial)
      await paymentFulfillmentModel.create({
        paymentFlowId,
        paymentMethod: 'bank_transfer',
        confirmationRefId: uuid(),
      } as TestPartial)

      jest.spyOn(fjsChargeModel, 'findOne').mockRestore()

      // The concurrent finalizer's row, already committed.
      const winner = await fjsChargeModel.create({
        paymentFlowId,
        receptionId: 'recept-winner',
        user4: 'doc-winner',
        status: 'paid',
      } as TestPartial)

      // FJS's dedup did not hold, so we come back with a second, distinct reception id.
      jest.spyOn(chargeFjsService, 'createCharge').mockResolvedValueOnce({
        receptionID: 'recept-duplicate',
        user4: 'doc-duplicate',
      } as TestPartial)

      // No mock for the failing insert: the index is declared on the model, so the real partial
      // unique constraint rejects it — the winner above holds the one active row for this flow.

      // `logger` is a singleton, so `spyOn` may return an earlier test's spy with its history.
      // Clear rather than restore — restoring would uninstall a spy other spec files rely on.
      const errorSpy = jest.spyOn(logger, 'error')
      errorSpy.mockClear()

      const result = await service.createFjsCharge(
        paymentFlowId,
        chargePayloadWithPayInfo(paymentFlowId),
      )

      // Adopted the winner rather than failing a caller whose charge did reach FJS.
      expect(result.id).toBe(winner.id)
      expect(result.receptionId).toBe('recept-winner')

      // The duplicate's reception id is the only handle for reversing the extra charge.
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('FJS accepted a duplicate charge'),
        expect.objectContaining({
          // Part of the alerting contract, so pinned here.
          needsManualReversal: true,
          receptionId: 'recept-duplicate',
          user4: 'doc-duplicate',
        }),
      )

      // And the fulfillment ends up linked to exactly one charge.
      const fulfillment = await paymentFulfillmentModel.findOne({
        where: { paymentFlowId, isDeleted: false },
      })
      expect(fulfillment?.fjsChargeId).toBe(winner.id)
    })

    it('does not claim a duplicate when FJS returns the reception id we already hold', async () => {
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
      const logger = app.get<Logger>(LOGGER_PROVIDER)

      const paymentFlowId = uuid()
      await paymentFlowModel.create({
        id: paymentFlowId,
        payerNationalId: '1234567890',
        availablePaymentMethods: [PaymentMethod.CARD],
        organisationId: '5534567890',
      } as TestPartial)
      await paymentFulfillmentModel.create({
        paymentFlowId,
        paymentMethod: 'bank_transfer',
        confirmationRefId: uuid(),
      } as TestPartial)

      jest.spyOn(fjsChargeModel, 'findOne').mockRestore()

      const existing = await fjsChargeModel.create({
        paymentFlowId,
        receptionId: 'recept-same',
        user4: 'doc-same',
        status: 'paid',
      } as TestPartial)

      // FJS hands back the charge it already had, so the reception id matches the row we collide
      // with. Nothing was duplicated.
      jest.spyOn(chargeFjsService, 'createCharge').mockResolvedValueOnce({
        receptionID: 'recept-same',
        user4: 'doc-same',
      } as TestPartial)

      jest
        .spyOn(fjsChargeModel, 'create')
        .mockRejectedValueOnce(
          Object.assign(
            new Error('duplicate key value violates unique constraint'),
            { name: 'SequelizeUniqueConstraintError' },
          ),
        )

      // `logger` is a singleton, so `spyOn` may return an earlier test's spy with its history.
      // Clear rather than restore — restoring would uninstall a spy other spec files rely on.
      const errorSpy = jest.spyOn(logger, 'error')
      errorSpy.mockClear()

      const result = await service.createFjsCharge(
        paymentFlowId,
        chargePayloadWithPayInfo(paymentFlowId),
      )

      expect(result.id).toBe(existing.id)
      // The alert must not fire: there is no orphaned charge to reverse.
      expect(errorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('FJS accepted a duplicate charge'),
        expect.anything(),
      )
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
