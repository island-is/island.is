import { ConfigType } from '@nestjs/config'
import { BadRequestException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import {
  BankTransferErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'

import { PaymentMethod, PaymentStatus } from '../../types'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
import { BankTransferStatus } from './bankTransfer.types'
import { BankTransferService } from './bankTransfer.service'
import { BankTransferModuleConfig } from './bankTransfer.config'
import { BankTransferLocale } from './dtos/createBankTransfer.input'
import { BankTransferPayment } from './models/bankTransferPayment.model'

const config: ConfigType<typeof BankTransferModuleConfig> = {
  apiKey: 'test-key',
  baseUrl: 'https://stage.blikk.tech',
  paymentTtlSeconds: 300,
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

const mockFetchResponse = (opts: {
  ok: boolean
  status: number
  json: unknown
}) =>
  ({
    ok: opts.ok,
    status: opts.status,
    json: jest.fn().mockResolvedValue(opts.json),
  } as unknown as Response)

describe('BankTransferService', () => {
  let logger: jest.Mocked<Logger>
  let service: BankTransferService
  let fetchMock: jest.Mock
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
    service = new BankTransferService(
      logger,
      config,
      bankTransferPaymentModel as unknown as typeof BankTransferPayment,
      paymentFulfillmentModel as unknown as typeof PaymentFulfillment,
      paymentFlowService as unknown as PaymentFlowService,
      paymentFlowConfig,
    )
    fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('createBankTransferPayment', () => {
    it('sends API-Key header, ISK currency and mapped items, and parses the response', async () => {
      fetchMock.mockResolvedValue(
        mockFetchResponse({
          ok: true,
          status: 200,
          json: {
            id: 'provider-123',
            status: 'DRAFT',
            scaRedirectUrl: 'https://stage.blikk.tech/sca/provider-123',
            message: '',
          },
        }),
      )

      const result = await service.createBankTransferPayment({
        amount: 14000,
        currency: 'ISK',
        paymentFlowId: 'flow-1',
        // Per-attempt key (distinct from paymentFlowId on purpose).
        correlationId: 'btp-9b1c',
        callbackUrl: 'https://island.is/api/bank-transfer/callback',
        partnerRedirectUrl: 'https://island.is/greida/is/flow-1',
        expiresAt: 1234567890,
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

      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [url, options] = fetchMock.mock.calls[0]
      expect(url).toBe('https://stage.blikk.tech/ecom/v3/payments')
      expect(options.method).toBe('POST')
      expect(options.headers['API-Key']).toBe('test-key')
      expect(options.headers['Content-Type']).toBe('application/json')

      const body = JSON.parse(options.body)
      expect(body.currency).toBe('ISK')
      // The provider idempotency key is the per-attempt sourceReferenceId, not the paymentFlowId.
      expect(body.sourceReferenceId).toBe('btp-9b1c')
      expect(body.expiresAt).toBe(1234567890)
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
      })
    })

    it('throws a mapped error and logs on a non-2xx response', async () => {
      fetchMock.mockResolvedValue(
        mockFetchResponse({
          ok: false,
          status: 400,
          json: { message: 'bad request' },
        }),
      )

      await expect(
        service.createBankTransferPayment({
          amount: 100,
          currency: 'ISK',
          paymentFlowId: 'flow-1',
          correlationId: 'btp-err',
        }),
      ).rejects.toThrow(BankTransferErrorCode.FailedToCreateBankTransfer)
      expect(logger.error).toHaveBeenCalled()
    })

    it('throws a mapped error when the request fails (network/timeout/abort)', async () => {
      fetchMock.mockRejectedValue(
        Object.assign(new Error('aborted'), { name: 'AbortError' }),
      )

      await expect(
        service.createBankTransferPayment({
          amount: 100,
          currency: 'ISK',
          paymentFlowId: 'flow-1',
          correlationId: 'btp-err',
        }),
      ).rejects.toThrow(BankTransferErrorCode.FailedToCreateBankTransfer)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('getPayment', () => {
    it('parses the authoritative response and normalizes the status', async () => {
      fetchMock.mockResolvedValue(
        mockFetchResponse({
          ok: true,
          status: 200,
          json: {
            id: 'provider-123',
            status: 'SUCCESS',
            scaRedirectUrl: '',
            message: '',
          },
        }),
      )

      const result = await service.getPayment('provider-123')

      const [url, options] = fetchMock.mock.calls[0]
      expect(url).toBe('https://stage.blikk.tech/ecom/v3/payments/provider-123')
      expect(options.method).toBe('GET')
      expect(options.headers['API-Key']).toBe('test-key')

      expect(result.providerPaymentId).toBe('provider-123')
      expect(result.rawStatus).toBe('SUCCESS')
      expect(result.status).toBe(BankTransferStatus.SUCCESS)
      // Empty scaRedirectUrl (back-channel SCA) is surfaced as undefined.
      expect(result.scaRedirectUrl).toBeUndefined()
    })

    it('throws a mapped error on a non-2xx response', async () => {
      fetchMock.mockResolvedValue(
        mockFetchResponse({ ok: false, status: 404, json: {} }),
      )

      await expect(service.getPayment('missing')).rejects.toThrow(
        BankTransferErrorCode.FailedToFetchBankTransfer,
      )
    })

    it('throws BadRequestException when the response shape is invalid', async () => {
      fetchMock.mockResolvedValue(
        mockFetchResponse({ ok: true, status: 200, json: { foo: 'bar' } }),
      )

      await expect(service.getPayment('provider-123')).rejects.toBeInstanceOf(
        BadRequestException,
      )
      expect(logger.error).toHaveBeenCalled()
    })

    it('logs a warning and maps an unknown status to PENDING', async () => {
      fetchMock.mockResolvedValue(
        mockFetchResponse({
          ok: true,
          status: 200,
          json: {
            id: 'provider-123',
            status: 'WAT',
            scaRedirectUrl: '',
            message: '',
          },
        }),
      )

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
    }

    const mockBlikkCreate = () =>
      jest.spyOn(service, 'createBankTransferPayment').mockResolvedValue({
        providerPaymentId: 'prov-1',
        rawStatus: 'PENDING',
        status: BankTransferStatus.PENDING,
        scaRedirectUrl: 'https://blikk/sca',
        message: undefined,
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
      jest
        .spyOn(service, 'getPayment')
        .mockRejectedValue(new Error('network'))
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

      // Provider call gets the correct URLs/amount and a per-attempt correlationId (NOT paymentFlowId).
      expect(blikkSpy).toHaveBeenCalledTimes(1)
      const blikkArg = blikkSpy.mock.calls[0][0]
      expect(blikkArg).toMatchObject({
        paymentFlowId: 'flow-1',
        amount: 14000,
        currency: 'ISK',
        callbackUrl: 'https://island.is/greida/api/bank-transfer/callback',
        partnerRedirectUrl: 'https://island.is/greida/is/flow-1',
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

      // expiresAt on the response matches the row (which is the same value we sent Blikk).
      expect(result).toEqual({
        providerPaymentId: 'prov-1',
        scaRedirectUrl: 'https://blikk/sca',
        expiresAt: rowArg.expiresAt,
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

    it('records the provider status on its own row', async () => {
      await service.finalizeBankTransferSuccess(confirmInput)

      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { lastKnownStatus: 'SUCCESS' },
        { where: { id: 'btp-1', paymentFlowId: 'flow-1', isDeleted: false } },
      )
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
            paymentMeans: 'Millifærsla',
            RRN: 'prov-1',
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

    it('looks up the active row by providerPaymentId', async () => {
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
    })

    it('looks up the active row by paymentFlowId when providerPaymentId is absent', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(activeRow)
      mockGetPayment(BankTransferStatus.PENDING, 'PENDING')

      await service.verify({ paymentFlowId: 'flow-1' })

      expect(bankTransferPaymentModel.findOne).toHaveBeenCalledWith({
        where: { paymentFlowId: 'flow-1', isDeleted: false },
      })
    })

    it('throws BankTransferNotFound when no row is found', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(null)

      await expect(
        service.verify({ paymentFlowId: 'flow-1' }),
      ).rejects.toThrow(BankTransferErrorCode.BankTransferNotFound)
    })

    it('throws BankTransferNotFound when no lookup key is provided', async () => {
      // No findOne call — findActiveBankTransferPayment returns null without keys.
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

    it.each<[BankTransferStatus, string]>([
      [BankTransferStatus.ERROR, 'ERROR'],
      [BankTransferStatus.REJECTED, 'REJECTED'],
      [BankTransferStatus.CANCELLED, 'CANCELLED'],
    ])(
      'persists lastKnownStatus and emits payment_failed when the provider reports %s (row stays alive for BANK_TRANSFER_FAILED rendering)',
      async (status, rawStatus) => {
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
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('calls Blikk GET then DELETE and soft-deletes the row when PENDING + fresh and Blikk still says PENDING', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      // 1st call: authoritative GET — Blikk confirms still PENDING.
      fetchMock.mockResolvedValueOnce(
        mockFetchResponse({
          ok: true,
          status: 200,
          json: { id: 'prov-1', status: 'PENDING' },
        }),
      )
      // 2nd call: DELETE on Blikk.
      fetchMock.mockResolvedValueOnce(
        mockFetchResponse({ ok: true, status: 204, json: {} }),
      )

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

      expect(fetchMock).toHaveBeenCalledTimes(2)
      const [getUrl, getOptions] = fetchMock.mock.calls[0]
      expect(getUrl).toBe('https://stage.blikk.tech/ecom/v3/payments/prov-1')
      expect(getOptions.method).toBe('GET')
      const [deleteUrl, deleteOptions] = fetchMock.mock.calls[1]
      expect(deleteUrl).toBe('https://stage.blikk.tech/ecom/v3/payments/prov-1')
      expect(deleteOptions.method).toBe('DELETE')

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
      expect(result).toEqual({ ok: true })
    })

    // Closes the cancel-vs-settlement race: if Blikk has settled but the webhook
    // hasn't reached us yet, the cached PENDING row would silently soft-delete a
    // paid attempt and the late webhook would be dropped by `isDeleted: false` —
    // user could re-pay and get double-charged. The authoritative GET inside
    // cancel finalizes SUCCESS and refuses the cancel.
    it('throws PaymentFlowAlreadyPaid and finalizes success when the refresh GET shows SUCCESS', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      // Cached row is PENDING; Blikk now reports SUCCESS.
      fetchMock.mockResolvedValueOnce(
        mockFetchResponse({
          ok: true,
          status: 200,
          json: { id: 'prov-1', status: 'SUCCESS' },
        }),
      )
      const finalizeSpy = jest
        .spyOn(service, 'finalizeBankTransferSuccess')
        .mockResolvedValue()

      await expect(
        service.cancel({ paymentFlowId: 'flow-1' }),
      ).rejects.toThrow(PaymentServiceCode.PaymentFlowAlreadyPaid)

      expect(finalizeSpy).toHaveBeenCalledWith({
        correlationId: 'corr-1',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-1',
        rawStatus: 'SUCCESS',
      })
      // Blikk DELETE was never called — we don't try to cancel a settled payment.
      expect(fetchMock).toHaveBeenCalledTimes(1)
      // Local soft-delete also did NOT happen.
      expect(bankTransferPaymentModel.update).not.toHaveBeenCalled()
      // No payment_cancelled event fired.
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it.each<[string]>([['ERROR'], ['REJECTED'], ['CANCELLED']])(
      'finalizes %s (emits payment_failed) and soft-deletes without emitting payment_cancelled when the refresh GET shows the failure',
      async (failureRawStatus) => {
        bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
        // 1st call: refresh GET reveals the terminal failure.
        fetchMock.mockResolvedValueOnce(
          mockFetchResponse({
            ok: true,
            status: 200,
            json: {
              id: 'prov-1',
              status: failureRawStatus,
              message: 'provider detail',
            },
          }),
        )

        const result = await service.cancel({ paymentFlowId: 'flow-1' })

        // Blikk DELETE was NOT called — the attempt is already terminal at Blikk.
        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock.mock.calls[0][1].method).toBe('GET')

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

    it('falls through to the Blikk DELETE on cached state when the refresh GET fails (network)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      // 1st call: refresh GET fails.
      fetchMock.mockRejectedValueOnce(new Error('ECONNRESET'))
      // 2nd call: DELETE succeeds, so the cancel proceeds to soft-delete.
      fetchMock.mockResolvedValueOnce(
        mockFetchResponse({ ok: true, status: 204, json: {} }),
      )

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(fetchMock.mock.calls[0][1].method).toBe('GET')
      expect(fetchMock.mock.calls[1][1].method).toBe('DELETE')

      // Cached PENDING soft-delete uses the cached lastKnownStatus race-guard.
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
      expect(result).toEqual({ ok: true })
    })

    it('skips the Blikk call but still soft-deletes the row when the row is already terminal-failed', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'REJECTED',
      })

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

      expect(fetchMock).not.toHaveBeenCalled()
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
      expect(result).toEqual({ ok: true })
    })

    it('soft-deletes the row when the Blikk cancel returns 404 (nothing live to orphan)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      // GET: Blikk still PENDING.
      fetchMock.mockResolvedValueOnce(
        mockFetchResponse({
          ok: true,
          status: 200,
          json: { id: 'prov-1', status: 'PENDING' },
        }),
      )
      // DELETE: 404 — the payment is unknown to Blikk, nothing live to orphan.
      fetchMock.mockResolvedValueOnce(
        mockFetchResponse({ ok: false, status: 404, json: {} }),
      )

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

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
      expect(result).toEqual({ ok: true })
    })

    // Blikk only cancels DRAFT payments; a non-2xx (other than 404) means the payment is past DRAFT /
    // live. Soft-deleting it would hide a possible settlement from the webhook/polling backstop and
    // orphan the money, so we refuse the cancel instead.
    it('throws and does NOT soft-delete when the Blikk cancel returns a non-2xx (payment is live)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      // GET: Blikk still PENDING.
      fetchMock.mockResolvedValueOnce(
        mockFetchResponse({
          ok: true,
          status: 200,
          json: { id: 'prov-1', status: 'PENDING' },
        }),
      )
      // DELETE: 409 — Blikk refuses to cancel a payment that is no longer in DRAFT.
      fetchMock.mockResolvedValueOnce(
        mockFetchResponse({ ok: false, status: 409, json: {} }),
      )

      await expect(service.cancel({ paymentFlowId: 'flow-1' })).rejects.toThrow(
        BankTransferErrorCode.BankTransferAlreadyInProgress,
      )

      expect(fetchMock).toHaveBeenCalledTimes(2)
      // The live payment must NOT be soft-deleted, and no payment_cancelled event fires.
      expect(bankTransferPaymentModel.update).not.toHaveBeenCalled()
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it('throws and does NOT soft-delete when the Blikk cancel request fails (network)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      // GET: Blikk still PENDING.
      fetchMock.mockResolvedValueOnce(
        mockFetchResponse({
          ok: true,
          status: 200,
          json: { id: 'prov-1', status: 'PENDING' },
        }),
      )
      // DELETE: network failure — we can't confirm the cancel, so fail safe.
      fetchMock.mockRejectedValueOnce(new Error('ECONNRESET'))

      await expect(service.cancel({ paymentFlowId: 'flow-1' })).rejects.toThrow(
        BankTransferErrorCode.BankTransferAlreadyInProgress,
      )

      expect(bankTransferPaymentModel.update).not.toHaveBeenCalled()
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it('skips the Blikk call when the row is PENDING but past expiresAt (Blikk has already cleaned up)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        expiresAt: new Date(Date.now() - 10 * 60 * 1000),
      })

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

      expect(fetchMock).not.toHaveBeenCalled()
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
      expect(result).toEqual({ ok: true })
    })

    it('emits payment_cancelled when cancelling an active PENDING row', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      fetchMock.mockResolvedValue(
        mockFetchResponse({ ok: true, status: 204, json: {} }),
      )

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

    it('does not emit when cancelling a terminal-failed row', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'REJECTED',
      })

      await service.cancel({ paymentFlowId: 'flow-1' })

      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it('does not emit when cancelling an expired PENDING row', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        expiresAt: new Date(Date.now() - 10 * 60 * 1000),
      })

      await service.cancel({ paymentFlowId: 'flow-1' })

      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it('does not emit when the soft-delete affects no rows (race loss)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      bankTransferPaymentModel.update.mockResolvedValueOnce([0])
      fetchMock.mockResolvedValue(
        mockFetchResponse({ ok: true, status: 204, json: {} }),
      )

      await service.cancel({ paymentFlowId: 'flow-1' })

      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it('throws PaymentFlowAlreadyPaid and does not soft-delete when the row is already SUCCESS', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...baseRow,
        lastKnownStatus: 'SUCCESS',
      })

      await expect(
        service.cancel({ paymentFlowId: 'flow-1' }),
      ).rejects.toThrow(PaymentServiceCode.PaymentFlowAlreadyPaid)

      expect(bankTransferPaymentModel.update).not.toHaveBeenCalled()
      expect(fetchMock).not.toHaveBeenCalled()
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it('throws PaymentFlowAlreadyPaid when the row flips to SUCCESS between fetch and soft-delete (race)', async () => {
      bankTransferPaymentModel.findOne
        .mockResolvedValueOnce(baseRow)
        .mockResolvedValueOnce({ ...baseRow, lastKnownStatus: 'SUCCESS' })
      bankTransferPaymentModel.update.mockResolvedValueOnce([0])
      fetchMock.mockResolvedValue(
        mockFetchResponse({ ok: true, status: 204, json: {} }),
      )

      await expect(
        service.cancel({ paymentFlowId: 'flow-1' }),
      ).rejects.toThrow(PaymentServiceCode.PaymentFlowAlreadyPaid)

      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it('returns { ok: true } when the soft-delete races against a concurrent cancel (idempotent)', async () => {
      bankTransferPaymentModel.findOne
        .mockResolvedValueOnce(baseRow)
        .mockResolvedValueOnce({ ...baseRow, isDeleted: true })
      bankTransferPaymentModel.update.mockResolvedValueOnce([0])
      fetchMock.mockResolvedValue(
        mockFetchResponse({ ok: true, status: 204, json: {} }),
      )

      const result = await service.cancel({ paymentFlowId: 'flow-1' })

      expect(result).toEqual({ ok: true })
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })
  })

  describe('finalizeBankTransferSuccess — idempotency guard', () => {
    it('bails without creating a fulfillment when the update affects zero rows (late cancel race)', async () => {
      bankTransferPaymentModel.update.mockResolvedValueOnce([0])
      const fulfillmentSpy = jest.spyOn(
        service,
        'createBankTransferFulfillment',
      )

      await service.finalizeBankTransferSuccess({
        correlationId: 'corr-1',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-1',
        rawStatus: 'SUCCESS',
      })

      expect(fulfillmentSpy).not.toHaveBeenCalled()
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
      })
    })

    it('confirms the payment inline when Blikk now reports SUCCESS and returns null', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(baseRow)
      mockGetPayment(BankTransferStatus.SUCCESS, 'SUCCESS')
      const confirmSpy = jest
        .spyOn(service, 'finalizeBankTransferSuccess')
        .mockResolvedValue()

      const result = await service.getBankTransferStatus('flow-1')

      expect(confirmSpy).toHaveBeenCalledWith({
        correlationId: 'corr-1',
        paymentFlowId: 'flow-1',
        providerPaymentId: 'prov-1',
        rawStatus: 'SUCCESS',
      })
      expect(result).toBeNull()
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
      jest
        .spyOn(service, 'getPayment')
        .mockRejectedValue(new Error('network'))

      const result = await service.getBankTransferStatus('flow-1')

      expect(result).toEqual({
        paymentStatus: PaymentStatus.BANK_TRANSFER_PENDING,
        updatedAt: baseRow.modified,
        bankTransferScaRedirectUrl: 'https://blikk/sca',
        bankTransferExpiresAt: baseRow.expiresAt,
      })
      expect(logger.warn).toHaveBeenCalled()
    })

    it('returns null and soft-deletes the row when the cached PENDING row is expired (no Blikk call)', async () => {
      const expired = {
        ...baseRow,
        expiresAt: new Date(Date.now() - 60 * 1000),
      }
      bankTransferPaymentModel.findOne.mockResolvedValue(expired)
      const getPaymentSpy = jest.spyOn(service, 'getPayment')

      const result = await service.getBankTransferStatus('flow-1')

      expect(getPaymentSpy).not.toHaveBeenCalled()
      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { isDeleted: true },
        { where: { id: 'corr-1', isDeleted: false } },
      )
      expect(result).toBeNull()
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

    it('no-ops when a fulfillment already exists for the flow', async () => {
      paymentFulfillmentModel.findOne.mockResolvedValue({
        id: 'existing',
      })
      await service.createBankTransferFulfillment(
        'flow-1',
        'corr-1',
        dummyCharge,
      )

      expect(paymentFulfillmentModel.create).not.toHaveBeenCalled()
      expect(paymentFlowService.createFjsCharge).not.toHaveBeenCalled()
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

    it('treats a unique-constraint race as a no-op (no FJS charge created)', async () => {
      paymentFulfillmentModel.create.mockRejectedValue(
        Object.assign(new Error('duplicate key'), {
          name: 'SequelizeUniqueConstraintError',
        }),
      )

      await expect(
        service.createBankTransferFulfillment('flow-1', 'corr-1', dummyCharge),
      ).resolves.toBeUndefined()
      expect(paymentFlowService.createFjsCharge).not.toHaveBeenCalled()
    })

    it('rethrows non-uniqueness errors from the fulfillment create', async () => {
      paymentFulfillmentModel.create.mockRejectedValue(
        new Error('connection reset'),
      )

      await expect(
        service.createBankTransferFulfillment('flow-1', 'corr-1', dummyCharge),
      ).rejects.toThrow('connection reset')
    })

    it('logs critically and keeps the fulfillment when the FJS charge keeps failing', async () => {
      paymentFlowService.createFjsCharge.mockRejectedValue(
        new Error('FJS down'),
      )

      await expect(
        service.createBankTransferFulfillment('flow-1', 'corr-1', dummyCharge),
      ).resolves.toBeUndefined()

      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledTimes(3)
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('manual reconciliation required'),
        expect.any(Object),
      )
    })
  })
})
