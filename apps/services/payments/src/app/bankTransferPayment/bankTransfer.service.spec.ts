import { Op } from 'sequelize'

import { ConfigType } from '@nestjs/config'
import { BadRequestException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { BlikkClientError, BlikkClientService } from '@island.is/clients/blikk'
import {
  BankTransferErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'

import { PaymentMethod, PaymentStatus } from '../../types'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
import {
  BankTransferFailureReason,
  BankTransferStatus,
  BankTransferPendingStatus,
} from './bankTransfer.types'
import { BankTransferService } from './bankTransfer.service'
import { BankTransferModuleConfig } from './bankTransfer.config'
import { BankTransferLocale } from './dtos/createBankTransfer.input'
import { BankTransferPayment } from './models/bankTransferPayment.model'

const config: ConfigType<typeof BankTransferModuleConfig> = {
  paymentTtlSeconds: 300,
  onboardingOrigin: 'https://light.blikk.tech',
  isConfigured: true,
}

const paymentFlowConfig: ConfigType<typeof PaymentFlowModuleConfig> = {
  webOrigin: 'https://island.is/greida',
  isConfigured: true,
}

const createMockLogger = (): jest.Mocked<Logger> =>
  ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  } as unknown as jest.Mocked<Logger>)

describe('BankTransferService', () => {
  let logger: jest.Mocked<Logger>
  let service: BankTransferService
  let blikkClient: {
    createPayment: jest.Mock
    getPayment: jest.Mock
    cancelPayment: jest.Mock
  }
  let bankTransferPaymentModel: {
    update: jest.Mock
    findOne: jest.Mock
    create: jest.Mock
  }
  let paymentFulfillmentModel: {
    findOne: jest.Mock
    create: jest.Mock
  }
  let paymentFlowService: {
    createFjsCharge: jest.Mock
    getPaymentFlowDetails: jest.Mock
    getPaymentFlowChargeDetails: jest.Mock
    isEligibleToBePaid: jest.Mock
    logPaymentFlowUpdate: jest.Mock
  }

  beforeEach(() => {
    logger = createMockLogger()
    bankTransferPaymentModel = {
      update: jest.fn().mockResolvedValue([1]),
      findOne: jest.fn(),
      create: jest.fn().mockResolvedValue({}),
    }
    paymentFulfillmentModel = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
    }
    paymentFlowService = {
      createFjsCharge: jest.fn().mockResolvedValue({ receptionId: 'r-1' }),
      getPaymentFlowDetails: jest.fn().mockResolvedValue({
        id: 'flow-1',
        organisationId: 'org-1',
        payerNationalId: '1234567890',
        charges: [{ chargeType: 'AB', chargeItemCode: 'AB123', quantity: 1 }],
        extraData: [],
      }),
      getPaymentFlowChargeDetails: jest.fn().mockResolvedValue({
        catalogItems: [
          {
            performingOrgID: 'org-1',
            chargeType: 'AB',
            chargeItemCode: 'AB123',
            chargeItemName: 'Vegabréf',
            priceAmount: 14000,
            quantity: 1,
          },
        ],
        totalPrice: 14000,
      }),
      isEligibleToBePaid: jest.fn().mockResolvedValue(true),
      logPaymentFlowUpdate: jest.fn().mockResolvedValue(undefined),
    }
    blikkClient = {
      createPayment: jest.fn(),
      getPayment: jest.fn(),
      cancelPayment: jest.fn().mockResolvedValue(undefined),
    }
    service = new BankTransferService(
      logger,
      config,
      bankTransferPaymentModel as unknown as typeof BankTransferPayment,
      paymentFulfillmentModel as unknown as typeof PaymentFulfillment,
      paymentFlowService as unknown as PaymentFlowService,
      paymentFlowConfig,
      blikkClient as unknown as BlikkClientService,
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('createBankTransferPayment', () => {
    it('maps the input to a Blikk request (ISK, mapped items) and normalizes the response', async () => {
      blikkClient.createPayment.mockResolvedValue({
        id: 'provider-123',
        status: 'DRAFT',
        scaRedirectUrl: 'https://stage.blikk.tech/sca/provider-123',
        message: '',
      })

      const result = await service.createBankTransferPayment({
        amount: 14000,
        currency: 'ISK',
        paymentFlowId: 'flow-1',
        // Per-attempt key (distinct from paymentFlowId on purpose).
        correlationId: 'btp-9b1c',
        callbackUrl: 'https://island.is/api/bank-transfer/callback',
        partnerRedirectUrl: 'https://island.is/greida/is/flow-1',
        expiresAt: 1234567890,
        debtorExternalId: '1234567890',
        bankAccountNumber: '123456789012',
        items: [
          {
            performingOrgID: '5500000000',
            chargeType: 'AB',
            chargeItemCode: 'AB123',
            chargeItemName: 'Vegabréf',
            priceAmount: 14000,
            quantity: 1,
          },
        ],
      })

      expect(blikkClient.createPayment).toHaveBeenCalledTimes(1)
      const body = blikkClient.createPayment.mock.calls[0][0]
      expect(body.currency).toBe('ISK')
      // The provider idempotency key is the per-attempt sourceReferenceId, not the paymentFlowId.
      expect(body.sourceReferenceId).toBe('btp-9b1c')
      expect(body.expiresAt).toBe(1234567890)
      // Payer national id → debtorExternalId + debtorName; entered BBAN → debtorBban (raw digits).
      expect(body.debtorExternalId).toBe('1234567890')
      expect(body.debtorName).toBe('1234567890')
      expect(body.debtorBban).toBe('123456789012')
      // Provider items: chargeItemName→name, priceAmount→string unitPrice, chargeItemCode→sku.
      expect(body.items).toEqual([
        { name: 'Vegabréf', quantity: 1, unitPrice: '14000', sku: 'AB123' },
      ])

      expect(result).toEqual({
        providerPaymentId: 'provider-123',
        rawStatus: 'DRAFT',
        status: BankTransferStatus.PENDING,
        scaRedirectUrl: 'https://stage.blikk.tech/sca/provider-123',
        message: undefined,
        // DRAFT with a regular SCA URL is a normal create — not onboarding.
        onboardingRequired: false,
      })
    })

    it('flags onboardingRequired for a DRAFT payment whose SCA URL points at the onboarding app', async () => {
      blikkClient.createPayment.mockResolvedValue({
        id: 'provider-123',
        status: 'DRAFT',
        scaRedirectUrl: 'https://light.blikk.tech/onboarding/provider-123',
        message: '',
      })

      const result = await service.createBankTransferPayment({
        amount: 14000,
        currency: 'ISK',
        paymentFlowId: 'flow-1',
        correlationId: 'btp-onboard',
      })

      expect(result.onboardingRequired).toBe(true)
    })

    it('maps a BlikkClientError to FailedToCreateBankTransfer', async () => {
      blikkClient.createPayment.mockRejectedValue(
        new BlikkClientError('bad request', 400),
      )

      await expect(
        service.createBankTransferPayment({
          amount: 100,
          currency: 'ISK',
          paymentFlowId: 'flow-1',
          correlationId: 'btp-err',
        }),
      ).rejects.toThrow(BankTransferErrorCode.FailedToCreateBankTransfer)
    })
  })

  describe('getPayment', () => {
    it('normalizes the authoritative response status', async () => {
      blikkClient.getPayment.mockResolvedValue({
        id: 'provider-123',
        status: 'SUCCESS',
        scaRedirectUrl: '',
        message: '',
      })

      const result = await service.getPayment('provider-123')

      expect(blikkClient.getPayment).toHaveBeenCalledWith('provider-123')
      expect(result.providerPaymentId).toBe('provider-123')
      expect(result.rawStatus).toBe('SUCCESS')
      expect(result.status).toBe(BankTransferStatus.SUCCESS)
      // Empty scaRedirectUrl (back-channel SCA) is surfaced as undefined.
      expect(result.scaRedirectUrl).toBeUndefined()
    })

    it('maps a BlikkClientError to FailedToFetchBankTransfer', async () => {
      blikkClient.getPayment.mockRejectedValue(
        new BlikkClientError('not found', 404),
      )

      await expect(service.getPayment('missing')).rejects.toThrow(
        BankTransferErrorCode.FailedToFetchBankTransfer,
      )
    })

    it('logs a warning and maps an unknown status to PENDING', async () => {
      blikkClient.getPayment.mockResolvedValue({
        id: 'provider-123',
        status: 'WAT',
        scaRedirectUrl: '',
        message: '',
      })

      const result = await service.getPayment('provider-123')

      expect(result.rawStatus).toBe('WAT')
      expect(result.status).toBe(BankTransferStatus.PENDING)
      expect(logger.warn).toHaveBeenCalled()
    })
  })

  describe('create', () => {
    const createInput = {
      paymentFlowId: 'flow-1',
      locale: BankTransferLocale.IS,
      bankAccountNumber: '123456789012',
    }

    const mockBlikkCreate = () =>
      jest.spyOn(service, 'createBankTransferPayment').mockResolvedValue({
        providerPaymentId: 'prov-1',
        rawStatus: 'PENDING',
        status: BankTransferStatus.PENDING,
        scaRedirectUrl: 'https://blikk/sca',
        message: undefined,
        onboardingRequired: false,
      })

    beforeEach(() => {
      bankTransferPaymentModel.findOne.mockResolvedValue(null)
    })

    it('throws PaymentFlowAlreadyPaid when the flow is already PAID', async () => {
      paymentFlowService.isEligibleToBePaid.mockResolvedValue(false)
      const blikkSpy = jest.spyOn(service, 'createBankTransferPayment')

      await expect(service.create(createInput)).rejects.toThrow(
        PaymentServiceCode.PaymentFlowAlreadyPaid,
      )
      expect(blikkSpy).not.toHaveBeenCalled()
      expect(bankTransferPaymentModel.create).not.toHaveBeenCalled()
    })

    it('throws BankTransferAlreadyInProgress when a fresh PENDING row exists (callback-race interlock)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        id: 'corr-existing',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-existing',
        lastKnownStatus: 'PENDING',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      })
      const blikkSpy = jest.spyOn(service, 'createBankTransferPayment')

      await expect(service.create(createInput)).rejects.toThrow(
        BankTransferErrorCode.BankTransferAlreadyInProgress,
      )
      expect(blikkSpy).not.toHaveBeenCalled()
      // Fresh PENDING must not be soft-deleted — that would race the success callback.
      expect(bankTransferPaymentModel.update).not.toHaveBeenCalled()
    })

    it.each<[string]>([['ERROR'], ['REJECTED'], ['CANCELLED']])(
      'soft-deletes an existing fresh terminal %s row and proceeds to start a new attempt',
      async (rawStatus) => {
        bankTransferPaymentModel.findOne.mockResolvedValue({
          id: 'corr-failed',
          paymentFlowId: 'flow-1',
          providerPaymentId: 'prov-failed',
          lastKnownStatus: rawStatus,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        })
        const blikkSpy = mockBlikkCreate()

        const result = await service.create(createInput)

        // Old row soft-deleted.
        expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
          { isDeleted: true },
          { where: { id: 'corr-failed', isDeleted: false } },
        )
        // New attempt actually started.
        expect(blikkSpy).toHaveBeenCalledTimes(1)
        expect(bankTransferPaymentModel.create).toHaveBeenCalledTimes(1)
        expect(result).toEqual({
          providerPaymentId: 'prov-1',
          scaRedirectUrl: 'https://blikk/sca',
          expiresAt: expect.any(Date),
          onboardingRequired: false,
        })
      },
    )

    it('soft-deletes an expired PENDING row and proceeds when Blikk confirms it is not SUCCESS', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        id: 'corr-expired',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-expired',
        lastKnownStatus: 'PENDING',
        expiresAt: new Date(Date.now() - 60 * 1000),
      })
      // Pre-discard safety check: Blikk says it's still PENDING (or any non-SUCCESS).
      const getPaymentSpy = jest
        .spyOn(service, 'getPayment')
        .mockResolvedValue({
          providerPaymentId: 'prov-expired',
          rawStatus: 'PENDING',
          status: BankTransferStatus.PENDING,
        })
      const blikkSpy = mockBlikkCreate()

      const result = await service.create(createInput)

      expect(getPaymentSpy).toHaveBeenCalledWith('prov-expired')
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { isDeleted: true },
        { where: { id: 'corr-expired', isDeleted: false } },
      )
      expect(blikkSpy).toHaveBeenCalledTimes(1)
      expect(bankTransferPaymentModel.create).toHaveBeenCalledTimes(1)
      expect(result.providerPaymentId).toBe('prov-1')
    })

    it('backfills via finalizeBankTransferSuccess when a stale PENDING row is actually SUCCESS on Blikk (orphan-SUCCESS safety check)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        id: 'corr-expired',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-expired',
        lastKnownStatus: 'PENDING',
        expiresAt: new Date(Date.now() - 60 * 1000),
      })
      jest.spyOn(service, 'getPayment').mockResolvedValue({
        providerPaymentId: 'prov-expired',
        rawStatus: 'SUCCESS',
        status: BankTransferStatus.SUCCESS,
      })
      const confirmSpy = jest
        .spyOn(service, 'finalizeBankTransferSuccess')
        .mockResolvedValue()
      const blikkSpy = jest.spyOn(service, 'createBankTransferPayment')

      await expect(service.create(createInput)).rejects.toThrow(
        PaymentServiceCode.PaymentFlowAlreadyPaid,
      )

      expect(confirmSpy).toHaveBeenCalledWith({
        correlationId: 'corr-expired',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-expired',
        rawStatus: 'SUCCESS',
      })
      // Critical: must not start a second Blikk payment.
      expect(blikkSpy).not.toHaveBeenCalled()
      expect(bankTransferPaymentModel.create).not.toHaveBeenCalled()
    })

    it('falls through to soft-delete when Blikk is unreachable during the stale-PENDING safety check', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        id: 'corr-expired',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-expired',
        lastKnownStatus: 'PENDING',
        expiresAt: new Date(Date.now() - 60 * 1000),
      })
      jest.spyOn(service, 'getPayment').mockRejectedValue(new Error('network'))
      const confirmSpy = jest.spyOn(service, 'finalizeBankTransferSuccess')
      const blikkSpy = mockBlikkCreate()

      const result = await service.create(createInput)

      expect(logger.warn).toHaveBeenCalled()
      expect(confirmSpy).not.toHaveBeenCalled()
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { isDeleted: true },
        { where: { id: 'corr-expired', isDeleted: false } },
      )
      expect(blikkSpy).toHaveBeenCalledTimes(1)
      expect(result.providerPaymentId).toBe('prov-1')
    })

    it('backfills via finalizeBankTransferSuccess when an orphan SUCCESS row exists and rejects as PaymentFlowAlreadyPaid', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        id: 'corr-success',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-success',
        lastKnownStatus: 'SUCCESS',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      })
      const confirmSpy = jest
        .spyOn(service, 'finalizeBankTransferSuccess')
        .mockResolvedValue()
      const blikkSpy = jest.spyOn(service, 'createBankTransferPayment')

      await expect(service.create(createInput)).rejects.toThrow(
        PaymentServiceCode.PaymentFlowAlreadyPaid,
      )

      expect(confirmSpy).toHaveBeenCalledWith({
        correlationId: 'corr-success',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-success',
        rawStatus: 'SUCCESS',
      })
      // Backfill path must not start a new Blikk payment.
      expect(blikkSpy).not.toHaveBeenCalled()
      expect(bankTransferPaymentModel.create).not.toHaveBeenCalled()
    })

    it('calls Blikk, persists the row, emits payment_started, and returns scaRedirectUrl + expiresAt', async () => {
      const blikkSpy = mockBlikkCreate()

      const result = await service.create(createInput)

      // Provider call gets the correct URLs/amount/payer details and a per-attempt
      // correlationId (NOT paymentFlowId).
      expect(blikkSpy).toHaveBeenCalledTimes(1)
      const blikkArg = blikkSpy.mock.calls[0][0]
      expect(blikkArg).toMatchObject({
        paymentFlowId: 'flow-1',
        amount: 14000,
        currency: 'ISK',
        callbackUrl: 'https://island.is/greida/api/bank-transfer/callback',
        partnerRedirectUrl: 'https://island.is/greida/is/flow-1',
        // payerNationalId from the getPaymentFlowDetails mock; BBAN from the input.
        debtorExternalId: '1234567890',
        bankAccountNumber: '123456789012',
      })
      expect(blikkArg.correlationId).not.toBe('flow-1')
      expect(blikkArg.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000))

      // Row is persisted with id == correlationId == sourceReferenceId.
      expect(bankTransferPaymentModel.create).toHaveBeenCalledTimes(1)
      const rowArg = bankTransferPaymentModel.create.mock.calls[0][0]
      expect(rowArg).toMatchObject({
        paymentFlowId: 'flow-1',
        provider: 'blikk',
        providerPaymentId: 'prov-1',
        scaRedirectUrl: 'https://blikk/sca',
        amount: 14000,
        lastKnownStatus: 'PENDING',
      })
      expect(rowArg.id).toBe(blikkArg.correlationId)
      expect(rowArg.sourceReferenceId).toBe(blikkArg.correlationId)
      // expires_at is set from config TTL (300 s in tests) and matches what we sent Blikk.
      expect(rowArg.expiresAt).toBeInstanceOf(Date)
      expect(rowArg.expiresAt.getTime()).toBe((blikkArg.expiresAt ?? 0) * 1000)

      // payment_started event fires once.
      expect(paymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledTimes(1)
      expect(
        paymentFlowService.logPaymentFlowUpdate.mock.calls[0][0],
      ).toMatchObject({
        paymentFlowId: 'flow-1',
        type: 'update',
        reason: 'payment_started',
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        metadata: { providerPaymentId: 'prov-1' },
      })

      // expiresAt on the response matches the row (which is the same value we sent Blikk),
      // and onboardingRequired passes through from the provider result (true-case covered
      // in the createBankTransferPayment describe).
      expect(result).toEqual({
        providerPaymentId: 'prov-1',
        scaRedirectUrl: 'https://blikk/sca',
        expiresAt: rowArg.expiresAt,
        onboardingRequired: false,
      })
    })

    it('emits payment_failed and rethrows when Blikk createBankTransferPayment fails', async () => {
      jest
        .spyOn(service, 'createBankTransferPayment')
        .mockRejectedValue(
          new BadRequestException(
            BankTransferErrorCode.FailedToCreateBankTransfer,
          ),
        )

      await expect(service.create(createInput)).rejects.toThrow(
        BankTransferErrorCode.FailedToCreateBankTransfer,
      )

      // No row persisted (Blikk failed before step 6).
      expect(bankTransferPaymentModel.create).not.toHaveBeenCalled()
      // The pre-persist failure event mirrors card's controller-level failure events.
      expect(paymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledTimes(1)
      expect(
        paymentFlowService.logPaymentFlowUpdate.mock.calls[0][0],
      ).toMatchObject({
        paymentFlowId: 'flow-1',
        type: 'update',
        reason: 'payment_failed',
      })
    })
  })

  describe('finalizeBankTransferSuccess', () => {
    const confirmInput = {
      correlationId: 'btp-1',
      paymentFlowId: 'flow-1',
      providerPaymentId: 'prov-1',
      rawStatus: 'SUCCESS',
    }

    it('records the provider status on its own row, guarded so the transition fires once', async () => {
      await service.finalizeBankTransferSuccess(confirmInput)

      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { lastKnownStatus: 'SUCCESS' },
        {
          where: {
            id: 'btp-1',
            paymentFlowId: 'flow-1',
            isDeleted: false,
            lastKnownStatus: { [Op.ne]: 'SUCCESS' },
          },
        },
      )
    })

    it('creates the fulfillment before marking the row SUCCESS', async () => {
      const order: string[] = []
      jest
        .spyOn(service, 'createBankTransferFulfillment')
        .mockImplementation(async () => {
          order.push('fulfillment')
        })
      bankTransferPaymentModel.update.mockImplementation(async () => {
        order.push('status')
        return [1]
      })

      await service.finalizeBankTransferSuccess(confirmInput)

      // Fulfillment must commit first so a SUCCESS lastKnownStatus always implies a paid flow.
      expect(order).toEqual(['fulfillment', 'status'])
    })

    it('passes a transfer charge payload to the fulfillment and notifies upstream', async () => {
      const fulfillmentSpy = jest
        .spyOn(service, 'createBankTransferFulfillment')
        .mockResolvedValue()

      await service.finalizeBankTransferSuccess(confirmInput)

      expect(paymentFlowService.getPaymentFlowDetails).toHaveBeenCalledWith(
        'flow-1',
      )
      expect(fulfillmentSpy).toHaveBeenCalledWith(
        'flow-1',
        'btp-1',
        expect.objectContaining({
          payInfo: expect.objectContaining({
            payableAmount: 14000,
            paymentMeans: 'Milli',
            RRN: 'prov-1',
            // Per-attempt correlationId is threaded into the FJS payInfo.
            correlationId: 'btp-1',
          }),
        }),
      )
      expect(paymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledTimes(1)
      const [update] = paymentFlowService.logPaymentFlowUpdate.mock.calls[0]
      expect(update).toMatchObject({
        paymentFlowId: 'flow-1',
        type: 'success',
        reason: 'payment_completed',
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        metadata: { providerPaymentId: 'prov-1' },
      })
    })
  })

  describe('verify', () => {
    const activeRow = {
      id: 'corr-1',
      paymentFlowId: 'flow-1',
      providerPaymentId: 'prov-1',
      lastKnownStatus: 'PENDING',
      provider: 'blikk',
      isDeleted: false,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    }

    const mockGetPayment = (
      status: BankTransferStatus,
      rawStatus: string,
      message?: string,
    ) =>
      jest.spyOn(service, 'getPayment').mockResolvedValue({
        providerPaymentId: 'prov-1',
        rawStatus,
        status,
        message,
      })

    it('looks up the active row by providerPaymentId, falling back to paymentFlowId', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(activeRow)
      mockGetPayment(BankTransferStatus.PENDING, 'PENDING')

      await service.verify({ providerPaymentId: 'prov-1' })
      expect(bankTransferPaymentModel.findOne).toHaveBeenCalledWith({
        where: {
          provider: 'blikk',
          providerPaymentId: 'prov-1',
          isDeleted: false,
        },
      })

      await service.verify({ paymentFlowId: 'flow-1' })
      expect(bankTransferPaymentModel.findOne).toHaveBeenCalledWith({
        where: { paymentFlowId: 'flow-1', isDeleted: false },
      })
    })

    it('throws BankTransferNotFound when no row is found or no lookup key is provided', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(null)
      await expect(service.verify({ paymentFlowId: 'flow-1' })).rejects.toThrow(
        BankTransferErrorCode.BankTransferNotFound,
      )

      // No findOne call — findActiveBankTransferPayment returns null without keys.
      bankTransferPaymentModel.findOne.mockClear()
      await expect(service.verify({})).rejects.toThrow(
        BankTransferErrorCode.BankTransferNotFound,
      )
      expect(bankTransferPaymentModel.findOne).not.toHaveBeenCalled()
    })

    it('short-circuits to SUCCESS without calling the provider when the flow is already PAID', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(activeRow)
      paymentFlowService.isEligibleToBePaid.mockResolvedValue(false)
      const getPaymentSpy = jest.spyOn(service, 'getPayment')

      const result = await service.verify({ paymentFlowId: 'flow-1' })

      expect(result).toEqual({ status: BankTransferStatus.SUCCESS })
      expect(getPaymentSpy).not.toHaveBeenCalled()
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it('calls finalizeBankTransferSuccess when the provider reports SUCCESS', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(activeRow)
      mockGetPayment(BankTransferStatus.SUCCESS, 'SUCCESS')
      const confirmSpy = jest
        .spyOn(service, 'finalizeBankTransferSuccess')
        .mockResolvedValue()

      const result = await service.verify({ paymentFlowId: 'flow-1' })

      expect(confirmSpy).toHaveBeenCalledWith({
        correlationId: 'corr-1',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-1',
        rawStatus: 'SUCCESS',
      })
      expect(result.status).toBe(BankTransferStatus.SUCCESS)
    })

    it.each<[BankTransferStatus, string, BankTransferFailureReason]>([
      [BankTransferStatus.ERROR, 'ERROR', BankTransferFailureReason.ERROR],
      [
        BankTransferStatus.REJECTED,
        'REJECTED',
        BankTransferFailureReason.REJECTED,
      ],
      [
        BankTransferStatus.CANCELLED,
        'CANCELLED',
        BankTransferFailureReason.CANCELLED,
      ],
    ])(
      'persists lastKnownStatus and emits payment_failed when the provider reports %s (row stays alive for BANK_TRANSFER_FAILED rendering)',
      async (status, rawStatus, failureReason) => {
        bankTransferPaymentModel.findOne.mockResolvedValue(activeRow)
        mockGetPayment(status, rawStatus, 'provider detail')

        const result = await service.verify({ paymentFlowId: 'flow-1' })

        expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
          { lastKnownStatus: rawStatus },
          {
            where: {
              id: 'corr-1',
              isDeleted: false,
              lastKnownStatus: activeRow.lastKnownStatus,
            },
          },
        )
        expect(paymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledTimes(1)
        const [update] = paymentFlowService.logPaymentFlowUpdate.mock.calls[0]
        expect(update).toMatchObject({
          paymentFlowId: 'flow-1',
          type: 'error',
          reason: 'payment_failed',
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          metadata: {
            providerPaymentId: 'prov-1',
            rawStatus,
            providerMessage: 'provider detail',
          },
        })
        expect(result.status).toBe(status)
        // The expiry-aware failure reason passes through (fresh row → 1:1 with the status).
        expect(result.failureReason).toBe(failureReason)
        // Pending-only fields must not leak onto a terminal response.
        expect(result.pendingStatus).toBeUndefined()
        expect(result.scaRedirectUrl).toBeUndefined()
      },
    )

    it('does not emit payment_failed when the lastKnownStatus update affects zero rows (race loser)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(activeRow)
      bankTransferPaymentModel.update.mockResolvedValue([0])
      mockGetPayment(BankTransferStatus.ERROR, 'ERROR')

      const result = await service.verify({ paymentFlowId: 'flow-1' })

      expect(bankTransferPaymentModel.update).toHaveBeenCalledTimes(1)
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
      expect(result.status).toBe(BankTransferStatus.ERROR)
    })

    it('updates lastKnownStatus race-guarded when the provider returns a different non-terminal status', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...activeRow,
        lastKnownStatus: 'DRAFT',
      })
      mockGetPayment(BankTransferStatus.PENDING, 'SCA_REQUIRED')

      const result = await service.verify({ paymentFlowId: 'flow-1' })

      // Race-guard pins the where-clause to the prior lastKnownStatus so concurrent
      // verify/refresh writers only land one drift update.
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { lastKnownStatus: 'SCA_REQUIRED' },
        {
          where: { id: 'corr-1', isDeleted: false, lastKnownStatus: 'DRAFT' },
        },
      )
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
      expect(result.status).toBe(BankTransferStatus.PENDING)
    })

    it('returns the pending sub-status and the fresh SCA URL from the provider', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(activeRow)
      jest.spyOn(service, 'getPayment').mockResolvedValue({
        providerPaymentId: 'prov-1',
        rawStatus: 'SCA_REQUIRED',
        status: BankTransferStatus.PENDING,
        scaRedirectUrl: 'https://blikk/sca/fresh',
      })

      const result = await service.verify({ paymentFlowId: 'flow-1' })

      expect(result).toEqual({
        status: BankTransferStatus.PENDING,
        message: undefined,
        pendingStatus: BankTransferPendingStatus.SCA_REQUIRED,
        scaRedirectUrl: 'https://blikk/sca/fresh',
      })
      // A pending attempt carries no failure reason. (The raw-status → pendingStatus
      // mapping itself is table-tested in bankTransfer.utils.spec.ts.)
      expect(result.failureReason).toBeUndefined()
    })

    it('reports sca_required for a DRAFT payment whose row already carries the SCA URL (no dots→QR flicker after create)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...activeRow,
        lastKnownStatus: 'DRAFT',
        scaRedirectUrl: 'https://stage.blikk.tech/sca/prov-1',
      })
      // Blikk GET repeats DRAFT and omits the URL — the row's creation-time URL is the fallback.
      mockGetPayment(BankTransferStatus.PENDING, 'DRAFT')

      const result = await service.verify({ paymentFlowId: 'flow-1' })

      expect(result.pendingStatus).toBe(BankTransferPendingStatus.SCA_REQUIRED)
      expect(result.scaRedirectUrl).toBe('https://stage.blikk.tech/sca/prov-1')
    })

    it('persists a newly minted SCA URL alongside the raw-status drift (back-channel create → SCA_REQUIRED)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...activeRow,
        lastKnownStatus: 'DRAFT',
        scaRedirectUrl: null,
      })
      jest.spyOn(service, 'getPayment').mockResolvedValue({
        providerPaymentId: 'prov-1',
        rawStatus: 'SCA_REQUIRED',
        status: BankTransferStatus.PENDING,
        scaRedirectUrl: 'https://blikk/sca/late',
      })

      await service.verify({ paymentFlowId: 'flow-1' })

      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        {
          lastKnownStatus: 'SCA_REQUIRED',
          scaRedirectUrl: 'https://blikk/sca/late',
        },
        {
          where: { id: 'corr-1', isDeleted: false, lastKnownStatus: 'DRAFT' },
        },
      )
    })

    it('persists an SCA URL that appears without a raw-status change', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...activeRow,
        lastKnownStatus: 'SCA_REQUIRED',
        scaRedirectUrl: null,
      })
      jest.spyOn(service, 'getPayment').mockResolvedValue({
        providerPaymentId: 'prov-1',
        rawStatus: 'SCA_REQUIRED',
        status: BankTransferStatus.PENDING,
        scaRedirectUrl: 'https://blikk/sca/late',
      })

      await service.verify({ paymentFlowId: 'flow-1' })

      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        {
          lastKnownStatus: 'SCA_REQUIRED',
          scaRedirectUrl: 'https://blikk/sca/late',
        },
        {
          where: {
            id: 'corr-1',
            isDeleted: false,
            lastKnownStatus: 'SCA_REQUIRED',
          },
        },
      )
    })

    it('does not overwrite an already-persisted SCA URL', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...activeRow,
        lastKnownStatus: 'DRAFT',
        scaRedirectUrl: 'https://blikk/sca/original',
      })
      jest.spyOn(service, 'getPayment').mockResolvedValue({
        providerPaymentId: 'prov-1',
        rawStatus: 'SCA_REQUIRED',
        status: BankTransferStatus.PENDING,
        scaRedirectUrl: 'https://blikk/sca/other',
      })

      await service.verify({ paymentFlowId: 'flow-1' })

      // Only the status drift is persisted — the creation-time URL stays.
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { lastKnownStatus: 'SCA_REQUIRED' },
        {
          where: { id: 'corr-1', isDeleted: false, lastKnownStatus: 'DRAFT' },
        },
      )
    })

    it('does not write or notify when the provider returns the same non-terminal status', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...activeRow,
        lastKnownStatus: 'PENDING',
      })
      mockGetPayment(BankTransferStatus.PENDING, 'PENDING')

      const result = await service.verify({ paymentFlowId: 'flow-1' })

      expect(bankTransferPaymentModel.update).not.toHaveBeenCalled()
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
      expect(result.status).toBe(BankTransferStatus.PENDING)
    })

    it('reports failureReason expired when the provider ERROR lands on a row past its TTL', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...activeRow,
        expiresAt: new Date(Date.now() - 60 * 1000),
      })
      mockGetPayment(BankTransferStatus.ERROR, 'ERROR', 'expired')

      const result = await service.verify({ paymentFlowId: 'flow-1' })

      expect(result.status).toBe(BankTransferStatus.ERROR)
      expect(result.failureReason).toBe(BankTransferFailureReason.EXPIRED)
    })
  })

  describe('cancel', () => {
    const baseRow = {
      id: 'corr-1',
      paymentFlowId: 'flow-1',
      providerPaymentId: 'prov-1',
      sourceReferenceId: 'corr-1',
      lastKnownStatus: 'PENDING',
      provider: 'blikk',
      isDeleted: false,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    }

    it('no-ops when there is no active row (idempotent)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(null)

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

      expect(result).toEqual({ ok: true })
      expect(bankTransferPaymentModel.update).not.toHaveBeenCalled()
      expect(blikkClient.getPayment).not.toHaveBeenCalled()
      expect(blikkClient.cancelPayment).not.toHaveBeenCalled()
    })

    it('refreshes then cancels on Blikk and soft-deletes the row when the payment is still DRAFT', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'DRAFT',
      })
      // Authoritative refresh — Blikk confirms still DRAFT (payer has not initiated).
      blikkClient.getPayment.mockResolvedValue({
        id: 'prov-1',
        status: 'DRAFT',
      })

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

      expect(blikkClient.getPayment).toHaveBeenCalledWith('prov-1')
      expect(blikkClient.cancelPayment).toHaveBeenCalledWith('prov-1')

      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { isDeleted: true },
        {
          where: {
            id: 'corr-1',
            isDeleted: false,
            lastKnownStatus: 'DRAFT',
          },
        },
      )
      expect(result).toEqual({ ok: true })
    })

    it('cancels on Blikk and soft-deletes when SCA_REQUIRED and Blikk honours the cancel', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'SCA_REQUIRED',
      })
      blikkClient.getPayment.mockResolvedValue({
        id: 'prov-1',
        status: 'SCA_REQUIRED',
      })
      // Default cancelPayment mock resolves (2xx) — Blikk confirmed the cancel.

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

      expect(blikkClient.cancelPayment).toHaveBeenCalledWith('prov-1')
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { isDeleted: true },
        {
          where: {
            id: 'corr-1',
            isDeleted: false,
            lastKnownStatus: 'SCA_REQUIRED',
          },
        },
      )
      expect(result).toEqual({ ok: true })
    })

    it('refuses and keeps the row live when SCA_REQUIRED and Blikk refuses the cancel', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'SCA_REQUIRED',
      })
      blikkClient.getPayment.mockResolvedValue({
        id: 'prov-1',
        status: 'SCA_REQUIRED',
      })
      // Blikk only honours cancels for DRAFT — a live SCA session yields a non-2xx (e.g. 409).
      blikkClient.cancelPayment.mockRejectedValue(
        new BlikkClientError('conflict', 409),
      )

      await expect(service.cancel({ paymentFlowId: 'flow-1' })).rejects.toThrow(
        BankTransferErrorCode.BankTransferCannotCancel,
      )

      expect(blikkClient.cancelPayment).toHaveBeenCalledWith('prov-1')
      // The still-live attempt must NOT be soft-deleted, and no payment_cancelled event fires.
      expect(bankTransferPaymentModel.update).not.toHaveBeenCalledWith(
        { isDeleted: true },
        expect.anything(),
      )
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it.each<[string]>([['PENDING'], ['SCA_COMPLETE']])(
      'refuses the cancel when the payment is %s (payer initiated/approved — settlement may be in flight)',
      async (rawStatus) => {
        bankTransferPaymentModel.findOne.mockResolvedValue({
          ...baseRow,
          lastKnownStatus: rawStatus,
        })
        blikkClient.getPayment.mockResolvedValue({
          id: 'prov-1',
          status: rawStatus,
        })

        await expect(
          service.cancel({ paymentFlowId: 'flow-1' }),
        ).rejects.toThrow(BankTransferErrorCode.BankTransferAlreadyInProgress)

        expect(blikkClient.cancelPayment).not.toHaveBeenCalled()
        // The live payment must NOT be soft-deleted, and no payment_cancelled event fires.
        expect(bankTransferPaymentModel.update).not.toHaveBeenCalledWith(
          { isDeleted: true },
          expect.anything(),
        )
        expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
      },
    )

    // Closes the cancel-vs-settlement race: if Blikk has settled but the webhook
    // hasn't reached us yet, the cached PENDING row would silently soft-delete a
    // paid attempt and the late webhook would be dropped by `isDeleted: false` —
    // user could re-pay and get double-charged. The authoritative refresh inside
    // cancel finalizes SUCCESS and refuses the cancel.
    it('throws PaymentFlowAlreadyPaid and finalizes success when the refresh shows SUCCESS', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      // Cached row is PENDING; Blikk now reports SUCCESS.
      blikkClient.getPayment.mockResolvedValue({
        id: 'prov-1',
        status: 'SUCCESS',
      })
      const finalizeSpy = jest
        .spyOn(service, 'finalizeBankTransferSuccess')
        .mockResolvedValue()

      await expect(service.cancel({ paymentFlowId: 'flow-1' })).rejects.toThrow(
        PaymentServiceCode.PaymentFlowAlreadyPaid,
      )

      expect(finalizeSpy).toHaveBeenCalledWith({
        correlationId: 'corr-1',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-1',
        rawStatus: 'SUCCESS',
      })
      // Blikk cancel was never called — we don't try to cancel a settled payment.
      expect(blikkClient.cancelPayment).not.toHaveBeenCalled()
      // Local soft-delete also did NOT happen.
      expect(bankTransferPaymentModel.update).not.toHaveBeenCalled()
      // No payment_cancelled event fired.
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it.each<[string]>([['ERROR'], ['REJECTED'], ['CANCELLED']])(
      'finalizes %s (emits payment_failed) and soft-deletes without emitting payment_cancelled when the refresh shows the failure',
      async (failureRawStatus) => {
        bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
        // Refresh reveals the terminal failure.
        blikkClient.getPayment.mockResolvedValue({
          id: 'prov-1',
          status: failureRawStatus,
          message: 'provider detail',
        })

        const result = await service.cancel({ paymentFlowId: 'flow-1' })

        // Blikk cancel was NOT called — the attempt is already terminal at Blikk.
        expect(blikkClient.cancelPayment).not.toHaveBeenCalled()

        // finalizeFromBlikkResult ran finalizeBankTransferFailure → terminal
        // status persisted with race-guard pinned to the cached PENDING value.
        expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
          { lastKnownStatus: failureRawStatus },
          {
            where: {
              id: 'corr-1',
              isDeleted: false,
              lastKnownStatus: 'PENDING',
            },
          },
        )

        // Soft-delete is race-guarded to the POST-finalize lastKnownStatus.
        expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
          { isDeleted: true },
          {
            where: {
              id: 'corr-1',
              isDeleted: false,
              lastKnownStatus: failureRawStatus,
            },
          },
        )

        // Exactly one event: payment_failed from finalizeBankTransferFailure.
        // No payment_cancelled because the row was already terminal at refresh time.
        expect(paymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledTimes(1)
        expect(
          paymentFlowService.logPaymentFlowUpdate.mock.calls[0][0],
        ).toMatchObject({
          paymentFlowId: 'flow-1',
          type: 'error',
          reason: 'payment_failed',
        })

        expect(result).toEqual({ ok: true })
      },
    )

    // Cancelling on cached state could soft-delete a payment that has since gone live at Blikk
    // (a stale DRAFT the payer just took to the bank), so a pending cancel requires a fresh
    // provider status — the error is retryable and the FE surfaces the cancel-failed toast.
    it.each<[string]>([['DRAFT'], ['PENDING']])(
      'throws FailedToFetchBankTransfer and touches nothing when the refresh fails on a cached %s row',
      async (cachedRawStatus) => {
        bankTransferPaymentModel.findOne.mockResolvedValue({
          ...baseRow,
          lastKnownStatus: cachedRawStatus,
        })
        blikkClient.getPayment.mockRejectedValue(
          new BlikkClientError('ECONNRESET'),
        )

        await expect(
          service.cancel({ paymentFlowId: 'flow-1' }),
        ).rejects.toThrow(BankTransferErrorCode.FailedToFetchBankTransfer)

        expect(blikkClient.cancelPayment).not.toHaveBeenCalled()
        expect(bankTransferPaymentModel.update).not.toHaveBeenCalled()
        expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
      },
    )

    it('skips the Blikk calls but still soft-deletes a terminal-failed row, without emitting payment_cancelled', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'REJECTED',
      })

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

      expect(blikkClient.getPayment).not.toHaveBeenCalled()
      expect(blikkClient.cancelPayment).not.toHaveBeenCalled()
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { isDeleted: true },
        {
          where: {
            id: 'corr-1',
            isDeleted: false,
            lastKnownStatus: 'REJECTED',
          },
        },
      )
      // The row already emitted payment_failed when it was finalized.
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
      expect(result).toEqual({ ok: true })
    })

    // A 404 means the payment is already gone at Blikk (it lapsed) — safe to discard locally.
    it('soft-deletes a DRAFT payment when the Blikk cancel returns 404 not-found (already gone)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'DRAFT',
      })
      blikkClient.getPayment.mockResolvedValue({ id: 'prov-1', status: 'DRAFT' })
      blikkClient.cancelPayment.mockRejectedValue(
        new BlikkClientError('gone', 404),
      )

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

      expect(blikkClient.cancelPayment).toHaveBeenCalledWith('prov-1')
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { isDeleted: true },
        {
          where: { id: 'corr-1', isDeleted: false, lastKnownStatus: 'DRAFT' },
        },
      )
      expect(result).toEqual({ ok: true })
    })

    // Any other non-2xx means Blikk still holds the session — refuse, keep the row live.
    it.each<[string, number]>([
      ['405 method-not-allowed', 405],
      ['409 conflict', 409],
    ])(
      'refuses and keeps the row live when the Blikk cancel returns %s',
      async (_label, status) => {
        bankTransferPaymentModel.findOne.mockResolvedValue({
          ...baseRow,
          lastKnownStatus: 'DRAFT',
        })
        blikkClient.getPayment.mockResolvedValue({
          id: 'prov-1',
          status: 'DRAFT',
        })
        blikkClient.cancelPayment.mockRejectedValue(
          new BlikkClientError('refused', status),
        )

        await expect(
          service.cancel({ paymentFlowId: 'flow-1' }),
        ).rejects.toThrow(BankTransferErrorCode.BankTransferCannotCancel)

        expect(blikkClient.cancelPayment).toHaveBeenCalledWith('prov-1')
        expect(bankTransferPaymentModel.update).not.toHaveBeenCalledWith(
          { isDeleted: true },
          expect.anything(),
        )
        expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
      },
    )

    // A network failure leaves the provider state unknown — never discard on a guess.
    it('throws FailedToFetchBankTransfer and keeps the row live when the Blikk cancel hits a network failure', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'DRAFT',
      })
      blikkClient.getPayment.mockResolvedValue({ id: 'prov-1', status: 'DRAFT' })
      blikkClient.cancelPayment.mockRejectedValue(
        new BlikkClientError('network down', undefined),
      )

      await expect(service.cancel({ paymentFlowId: 'flow-1' })).rejects.toThrow(
        BankTransferErrorCode.FailedToFetchBankTransfer,
      )

      expect(bankTransferPaymentModel.update).not.toHaveBeenCalledWith(
        { isDeleted: true },
        expect.anything(),
      )
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it('refreshes from Blikk before discarding an expired PENDING row, but does NOT call the Blikk cancel', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        expiresAt: new Date(Date.now() - 10 * 60 * 1000),
      })
      // Refresh confirms still PENDING at Blikk → safe to discard.
      blikkClient.getPayment.mockResolvedValue({
        id: 'prov-1',
        status: 'PENDING',
      })

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

      // We DO refresh (so a settled-but-uncallbacked transfer is finalized, not lost) but never
      // call the Blikk cancel for an expired row — its TTL already elapsed.
      expect(blikkClient.getPayment).toHaveBeenCalledWith('prov-1')
      expect(blikkClient.cancelPayment).not.toHaveBeenCalled()
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { isDeleted: true },
        {
          where: {
            id: 'corr-1',
            isDeleted: false,
            lastKnownStatus: 'PENDING',
          },
        },
      )
      // Only active (non-expired) cancels emit payment_cancelled.
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
      expect(result).toEqual({ ok: true })
    })

    // Bug fix: an expired PENDING row that actually settled at Blikk just before expiry (callback
    // lost) must be finalized and the cancel refused — otherwise "Start again" discards the settled
    // row and the payer can pay a second time.
    it('finalizes SUCCESS and throws PaymentFlowAlreadyPaid when an expired row settled at Blikk', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        expiresAt: new Date(Date.now() - 10 * 60 * 1000),
      })
      blikkClient.getPayment.mockResolvedValue({
        id: 'prov-1',
        status: 'SUCCESS',
      })
      const finalizeSpy = jest
        .spyOn(service, 'finalizeBankTransferSuccess')
        .mockResolvedValue()

      await expect(service.cancel({ paymentFlowId: 'flow-1' })).rejects.toThrow(
        PaymentServiceCode.PaymentFlowAlreadyPaid,
      )

      expect(finalizeSpy).toHaveBeenCalledWith({
        correlationId: 'corr-1',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-1',
        rawStatus: 'SUCCESS',
      })
      expect(blikkClient.cancelPayment).not.toHaveBeenCalled()
      // The settled row must NOT be soft-deleted.
      expect(bankTransferPaymentModel.update).not.toHaveBeenCalled()
    })

    it('emits payment_cancelled when cancelling an active DRAFT row', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'DRAFT',
      })
      blikkClient.getPayment.mockResolvedValue({
        id: 'prov-1',
        status: 'DRAFT',
      })

      await service.cancel({ paymentFlowId: 'flow-1' })

      expect(paymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledTimes(1)
      expect(paymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        {
          paymentFlowId: 'flow-1',
          type: 'update',
          occurredAt: expect.any(Date),
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          reason: 'payment_cancelled',
          message: 'Bank transfer cancelled by user',
          metadata: { providerPaymentId: 'prov-1', correlationId: 'corr-1' },
        },
        { useRetry: true, throwOnError: false },
      )
    })

    it('throws PaymentFlowAlreadyPaid and does not soft-delete when the row is already SUCCESS', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'SUCCESS',
      })

      await expect(service.cancel({ paymentFlowId: 'flow-1' })).rejects.toThrow(
        PaymentServiceCode.PaymentFlowAlreadyPaid,
      )

      expect(bankTransferPaymentModel.update).not.toHaveBeenCalled()
      expect(blikkClient.getPayment).not.toHaveBeenCalled()
      expect(blikkClient.cancelPayment).not.toHaveBeenCalled()
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it('throws PaymentFlowAlreadyPaid when the row flips to SUCCESS between refresh and soft-delete (race)', async () => {
      const draftRow = { ...baseRow, lastKnownStatus: 'DRAFT' }
      bankTransferPaymentModel.findOne
        .mockResolvedValueOnce(draftRow)
        .mockResolvedValueOnce({ ...draftRow, lastKnownStatus: 'SUCCESS' })
      bankTransferPaymentModel.update.mockResolvedValueOnce([0])
      blikkClient.getPayment.mockResolvedValue({
        id: 'prov-1',
        status: 'DRAFT',
      })

      await expect(service.cancel({ paymentFlowId: 'flow-1' })).rejects.toThrow(
        PaymentServiceCode.PaymentFlowAlreadyPaid,
      )

      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it('returns { ok: true } without emitting when the soft-delete races against a concurrent cancel (idempotent)', async () => {
      const draftRow = { ...baseRow, lastKnownStatus: 'DRAFT' }
      bankTransferPaymentModel.findOne
        .mockResolvedValueOnce(draftRow)
        .mockResolvedValueOnce({ ...draftRow, isDeleted: true })
      bankTransferPaymentModel.update.mockResolvedValueOnce([0])
      blikkClient.getPayment.mockResolvedValue({
        id: 'prov-1',
        status: 'DRAFT',
      })

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

      // Zero affected rows → the other writer won; no payment_cancelled from this call.
      expect(result).toEqual({ ok: true })
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })
  })

  describe('finalizeBankTransferSuccess — idempotency guard', () => {
    it('still repairs the fulfillment but skips the payment_completed event when the status was already SUCCESS (repair / race loser)', async () => {
      // Status update affects zero rows ⇒ no transition (row was already SUCCESS).
      bankTransferPaymentModel.update.mockResolvedValueOnce([0])
      const fulfillmentSpy = jest
        .spyOn(service, 'createBankTransferFulfillment')
        .mockResolvedValue()

      await service.finalizeBankTransferSuccess({
        correlationId: 'corr-1',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-1',
        rawStatus: 'SUCCESS',
      })

      // The fulfillment is (idempotently) ensured even when the status transition is a no-op.
      expect(fulfillmentSpy).toHaveBeenCalled()
      // …but the success event fires only on the actual transition.
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })
  })

  describe('getBankTransferStatus', () => {
    const baseRow = {
      id: 'corr-1',
      paymentFlowId: 'flow-1',
      providerPaymentId: 'prov-1',
      lastKnownStatus: 'PENDING',
      provider: 'blikk',
      isDeleted: false,
      scaRedirectUrl: 'https://blikk/sca',
      modified: new Date('2026-05-30T10:00:00Z'),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    }

    const mockGetPayment = (
      status: BankTransferStatus,
      rawStatus: string,
      message?: string,
    ) =>
      jest.spyOn(service, 'getPayment').mockResolvedValue({
        providerPaymentId: 'prov-1',
        rawStatus,
        status,
        message,
      })

    it('returns null when no active row exists', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(null)

      const result = await service.getBankTransferStatus('flow-1')

      expect(result).toBeNull()
    })

    it('refreshes from Blikk on fresh PENDING and surfaces BANK_TRANSFER_PENDING when still pending', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      const getPaymentSpy = mockGetPayment(
        BankTransferStatus.PENDING,
        'SCA_REQUIRED',
      )

      const result = await service.getBankTransferStatus('flow-1')

      expect(getPaymentSpy).toHaveBeenCalledWith('prov-1')
      // Race-guarded update to persist the raw-status drift.
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { lastKnownStatus: 'SCA_REQUIRED' },
        {
          where: {
            id: 'corr-1',
            isDeleted: false,
            lastKnownStatus: 'PENDING',
          },
        },
      )
      expect(result).toEqual({
        paymentStatus: PaymentStatus.BANK_TRANSFER_PENDING,
        updatedAt: baseRow.modified,
        bankTransferScaRedirectUrl: 'https://blikk/sca',
        bankTransferExpiresAt: baseRow.expiresAt,
        bankTransferPendingStatus: BankTransferPendingStatus.SCA_REQUIRED,
      })
    })

    it('surfaces sca_required right after create (DRAFT + SCA URL) so SSR renders the QR without a flicker', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'DRAFT',
      })
      mockGetPayment(BankTransferStatus.PENDING, 'DRAFT')

      const result = await service.getBankTransferStatus('flow-1')

      expect(result).toMatchObject({
        paymentStatus: PaymentStatus.BANK_TRANSFER_PENDING,
        bankTransferScaRedirectUrl: 'https://blikk/sca',
        bankTransferPendingStatus: BankTransferPendingStatus.SCA_REQUIRED,
      })
    })

    it('surfaces a freshly minted SCA URL from the refresh when the row has none yet', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        scaRedirectUrl: null,
      })
      jest.spyOn(service, 'getPayment').mockResolvedValue({
        providerPaymentId: 'prov-1',
        rawStatus: 'SCA_REQUIRED',
        status: BankTransferStatus.PENDING,
        scaRedirectUrl: 'https://blikk/sca/late',
      })

      const result = await service.getBankTransferStatus('flow-1')

      // Persisted for later reads…
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        {
          lastKnownStatus: 'SCA_REQUIRED',
          scaRedirectUrl: 'https://blikk/sca/late',
        },
        {
          where: {
            id: 'corr-1',
            isDeleted: false,
            lastKnownStatus: 'PENDING',
          },
        },
      )
      // …and surfaced immediately (the in-memory row predates the persist).
      expect(result).toMatchObject({
        paymentStatus: PaymentStatus.BANK_TRANSFER_PENDING,
        bankTransferScaRedirectUrl: 'https://blikk/sca/late',
        bankTransferPendingStatus: BankTransferPendingStatus.SCA_REQUIRED,
      })
    })

    it('confirms the payment inline when Blikk now reports SUCCESS and reports PAID from the committed fulfillment', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      mockGetPayment(BankTransferStatus.SUCCESS, 'SUCCESS')
      const confirmSpy = jest
        .spyOn(service, 'finalizeBankTransferSuccess')
        .mockResolvedValue()
      const fulfilledAt = new Date('2026-05-30T10:05:00Z')
      paymentFulfillmentModel.findOne.mockResolvedValue({
        created: fulfilledAt,
      })

      const result = await service.getBankTransferStatus('flow-1')

      expect(confirmSpy).toHaveBeenCalledWith({
        correlationId: 'corr-1',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-1',
        rawStatus: 'SUCCESS',
      })
      // PAID is surfaced (not null) so the controller never folds in a stale UNPAID snapshot.
      expect(result).toEqual({
        paymentStatus: PaymentStatus.PAID,
        updatedAt: fulfilledAt,
      })
    })

    it('repairs a cached-SUCCESS row whose fulfillment never committed and reports PAID', async () => {
      // base is UNPAID (controller gate) yet the row is already SUCCESS — the poison case.
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'SUCCESS',
      })
      const getPaymentSpy = jest.spyOn(service, 'getPayment')
      const confirmSpy = jest
        .spyOn(service, 'finalizeBankTransferSuccess')
        .mockResolvedValue()
      const fulfilledAt = new Date('2026-05-30T10:05:00Z')
      paymentFulfillmentModel.findOne.mockResolvedValue({
        created: fulfilledAt,
      })

      const result = await service.getBankTransferStatus('flow-1')

      // No Blikk round-trip — the cached SUCCESS is authoritative, we just repair the fulfillment.
      expect(getPaymentSpy).not.toHaveBeenCalled()
      expect(confirmSpy).toHaveBeenCalledWith({
        correlationId: 'corr-1',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-1',
        rawStatus: 'SUCCESS',
      })
      expect(result).toEqual({
        paymentStatus: PaymentStatus.PAID,
        updatedAt: fulfilledAt,
      })
    })

    it.each<[BankTransferStatus, string]>([
      [BankTransferStatus.ERROR, 'ERROR'],
      [BankTransferStatus.REJECTED, 'REJECTED'],
      [BankTransferStatus.CANCELLED, 'CANCELLED'],
    ])(
      'persists the terminal status, fires payment_failed, and surfaces BANK_TRANSFER_FAILED when Blikk now reports %s',
      async (status, rawStatus) => {
        bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
        mockGetPayment(status, rawStatus, 'provider detail')

        const result = await service.getBankTransferStatus('flow-1')

        // Race-guarded persist: scoped by the prior lastKnownStatus so concurrent verify/read
        // calls only fire the event once.
        expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
          { lastKnownStatus: rawStatus },
          {
            where: {
              id: baseRow.id,
              isDeleted: false,
              lastKnownStatus: baseRow.lastKnownStatus,
            },
          },
        )
        expect(paymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledTimes(1)
        const [update] = paymentFlowService.logPaymentFlowUpdate.mock.calls[0]
        expect(update).toMatchObject({
          paymentFlowId: 'flow-1',
          type: 'error',
          reason: 'payment_failed',
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          metadata: {
            providerPaymentId: 'prov-1',
            rawStatus,
            providerMessage: 'provider detail',
          },
        })
        expect(result).toEqual({
          paymentStatus: PaymentStatus.BANK_TRANSFER_FAILED,
          updatedAt: baseRow.modified,
          lastBankTransferFailure: status,
        })
      },
    )

    it('surfaces lastBankTransferFailure expired when the refresh reports ERROR on a row past its TTL', async () => {
      // Cached PENDING + expired: the refresh runs before any discard, and Blikk reports the
      // lapsed TTL as a plain ERROR — the overlay derives it as `expired` for the failed screen.
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        expiresAt: new Date(Date.now() - 60 * 1000),
      })
      mockGetPayment(BankTransferStatus.ERROR, 'ERROR', 'expired')

      const result = await service.getBankTransferStatus('flow-1')

      expect(result).toEqual({
        paymentStatus: PaymentStatus.BANK_TRANSFER_FAILED,
        updatedAt: baseRow.modified,
        lastBankTransferFailure: BankTransferFailureReason.EXPIRED,
      })
    })

    it('does not fire payment_failed when the race-guarded persist affects zero rows (concurrent verify won)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      bankTransferPaymentModel.update.mockResolvedValue([0])
      mockGetPayment(BankTransferStatus.ERROR, 'ERROR', 'provider detail')

      const result = await service.getBankTransferStatus('flow-1')

      expect(bankTransferPaymentModel.update).toHaveBeenCalledTimes(1)
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
      // Overlay is still surfaced so the FE renders the failed screen even on race-loss.
      expect(result).toEqual({
        paymentStatus: PaymentStatus.BANK_TRANSFER_FAILED,
        updatedAt: baseRow.modified,
        lastBankTransferFailure: BankTransferStatus.ERROR,
      })
    })

    it('falls through to the cached status when the Blikk refresh throws (read path stays alive)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      jest.spyOn(service, 'getPayment').mockRejectedValue(new Error('network'))

      const result = await service.getBankTransferStatus('flow-1')

      expect(result).toEqual({
        paymentStatus: PaymentStatus.BANK_TRANSFER_PENDING,
        updatedAt: baseRow.modified,
        bankTransferScaRedirectUrl: 'https://blikk/sca',
        bankTransferExpiresAt: baseRow.expiresAt,
        // Cached raw status is PENDING → processing.
        bankTransferPendingStatus: BankTransferPendingStatus.PROCESSING,
      })
      expect(logger.warn).toHaveBeenCalled()
    })

    it('refreshes from Blikk and soft-deletes an expired PENDING row that Blikk confirms is not settled', async () => {
      const expired = {
        ...baseRow,
        expiresAt: new Date(Date.now() - 60 * 1000),
      }
      bankTransferPaymentModel.findOne.mockResolvedValue(expired)
      const getPaymentSpy = mockGetPayment(
        BankTransferStatus.PENDING,
        'PENDING',
      )

      const result = await service.getBankTransferStatus('flow-1')

      // Even on expiry we ask Blikk first — only discard once it confirms the attempt is not a SUCCESS.
      expect(getPaymentSpy).toHaveBeenCalledWith('prov-1')
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { isDeleted: true },
        { where: { id: 'corr-1', isDeleted: false } },
      )
      expect(result).toBeNull()
    })

    it('finalizes an expired PENDING row that Blikk now reports as SUCCESS instead of orphaning the settlement (lost callback)', async () => {
      const expired = {
        ...baseRow,
        expiresAt: new Date(Date.now() - 60 * 1000),
      }
      bankTransferPaymentModel.findOne.mockResolvedValue(expired)
      mockGetPayment(BankTransferStatus.SUCCESS, 'SUCCESS')
      const confirmSpy = jest
        .spyOn(service, 'finalizeBankTransferSuccess')
        .mockResolvedValue()
      const fulfilledAt = new Date('2026-05-30T10:05:00Z')
      paymentFulfillmentModel.findOne.mockResolvedValue({
        created: fulfilledAt,
      })

      const result = await service.getBankTransferStatus('flow-1')

      expect(confirmSpy).toHaveBeenCalledWith({
        correlationId: 'corr-1',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-1',
        rawStatus: 'SUCCESS',
      })
      // The settled row must NOT be soft-deleted.
      expect(bankTransferPaymentModel.update).not.toHaveBeenCalledWith(
        { isDeleted: true },
        expect.anything(),
      )
      expect(result).toEqual({
        paymentStatus: PaymentStatus.PAID,
        updatedAt: fulfilledAt,
      })
    })

    it.each<[string, BankTransferStatus]>([
      ['ERROR', BankTransferStatus.ERROR],
      ['REJECTED', BankTransferStatus.REJECTED],
      ['CANCELLED', BankTransferStatus.CANCELLED],
    ])(
      'surfaces BANK_TRANSFER_FAILED for a fresh terminal %s row from the cache (no Blikk refresh)',
      async (rawStatus, expected) => {
        bankTransferPaymentModel.findOne.mockResolvedValue({
          ...baseRow,
          lastKnownStatus: rawStatus,
        })
        const getPaymentSpy = jest.spyOn(service, 'getPayment')

        const result = await service.getBankTransferStatus('flow-1')

        expect(getPaymentSpy).not.toHaveBeenCalled()
        expect(result).toEqual({
          paymentStatus: PaymentStatus.BANK_TRANSFER_FAILED,
          updatedAt: baseRow.modified,
          lastBankTransferFailure: expected,
        })
      },
    )

    it('soft-deletes and returns null for an expired terminal row', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'REJECTED',
        expiresAt: new Date(Date.now() - 60 * 1000),
      })

      const result = await service.getBankTransferStatus('flow-1')

      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { isDeleted: true },
        { where: { id: 'corr-1', isDeleted: false } },
      )
      expect(result).toBeNull()
    })

    it('returns null when the cached status is SUCCESS without a fulfillment (defers to PaymentFlowService)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'SUCCESS',
      })

      const result = await service.getBankTransferStatus('flow-1')

      expect(result).toBeNull()
    })
  })

  describe('createBankTransferFulfillment', () => {
    const dummyCharge = {} as never

    it('no-ops when a fulfillment already exists AND is linked to an FJS charge', async () => {
      paymentFulfillmentModel.findOne.mockResolvedValue({
        id: 'existing',
        fjsChargeId: 'fjs-1',
      })
      await service.createBankTransferFulfillment(
        'flow-1',
        'corr-1',
        dummyCharge,
      )

      expect(paymentFulfillmentModel.create).not.toHaveBeenCalled()
      expect(paymentFlowService.createFjsCharge).not.toHaveBeenCalled()
    })

    it('re-attempts the FJS charge when a fulfillment exists without an fjsChargeId', async () => {
      paymentFulfillmentModel.findOne.mockResolvedValue({
        id: 'existing',
        fjsChargeId: null,
      })
      await service.createBankTransferFulfillment(
        'flow-1',
        'corr-1',
        dummyCharge,
      )

      // Fulfillment already exists, so it is not re-created, but the charge is (re)attempted.
      expect(paymentFulfillmentModel.create).not.toHaveBeenCalled()
      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledWith(
        'flow-1',
        dummyCharge,
      )
    })

    it('creates the fulfillment and FJS charge on the first call', async () => {
      await service.createBankTransferFulfillment(
        'flow-1',
        'corr-1',
        dummyCharge,
      )

      expect(paymentFulfillmentModel.create).toHaveBeenCalledWith({
        paymentFlowId: 'flow-1',
        paymentMethod: 'bank_transfer',
        confirmationRefId: 'corr-1',
      })
      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledTimes(1)
      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledWith(
        'flow-1',
        dummyCharge,
      )
    })

    it('still ensures the FJS charge when the fulfillment create loses a unique-constraint race', async () => {
      paymentFulfillmentModel.create.mockRejectedValue(
        Object.assign(new Error('duplicate key'), {
          name: 'SequelizeUniqueConstraintError',
        }),
      )

      await expect(
        service.createBankTransferFulfillment('flow-1', 'corr-1', dummyCharge),
      ).resolves.toBeUndefined()
      // The other writer created the fulfillment; we still (idempotently) ensure the FJS charge.
      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledWith(
        'flow-1',
        dummyCharge,
      )
    })

    it('rethrows non-uniqueness errors from the fulfillment create', async () => {
      paymentFulfillmentModel.create.mockRejectedValue(
        new Error('connection reset'),
      )

      await expect(
        service.createBankTransferFulfillment('flow-1', 'corr-1', dummyCharge),
      ).rejects.toThrow('connection reset')
    })

    it('warns that the worker will retry and keeps the fulfillment when the FJS charge keeps failing', async () => {
      paymentFlowService.createFjsCharge.mockRejectedValue(
        new Error('FJS down'),
      )

      await expect(
        service.createBankTransferFulfillment('flow-1', 'corr-1', dummyCharge),
      ).resolves.toBeUndefined()

      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledTimes(3)
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('the payment worker will retry'),
        expect.any(Object),
      )
    })
  })

  describe('softDeleteRowForRefund / restoreRow', () => {
    it('soft-deletes the active row and returns its id', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        id: 'corr-1',
        paymentFlowId: 'flow-1',
        isDeleted: false,
      })

      const rowId = await service.softDeleteRowForRefund('flow-1')

      expect(rowId).toBe('corr-1')
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { isDeleted: true },
        { where: { id: 'corr-1', isDeleted: false } },
      )
    })

    it('returns null and does nothing when there is no active row', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(null)

      const rowId = await service.softDeleteRowForRefund('flow-1')

      expect(rowId).toBeNull()
      expect(bankTransferPaymentModel.update).not.toHaveBeenCalled()
    })

    it('restoreRow flips isDeleted back to false (guarded on isDeleted=true)', async () => {
      await service.restoreRow('corr-1')

      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { isDeleted: false },
        { where: { id: 'corr-1', isDeleted: true } },
      )
    })
  })
})
