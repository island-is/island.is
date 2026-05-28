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
import { BankTransferStatus } from './bankTransfer.types'
import { BankTransferService } from './bankTransfer.service'
import { BankTransferModuleConfig } from './bankTransfer.config'
import { BankTransferLocale } from './dtos/createBankTransfer.input'
import { BankTransferPayment } from './models/bankTransferPayment.model'

const config: ConfigType<typeof BankTransferModuleConfig> = {
  apiKey: 'test-key',
  baseUrl: 'https://stage.blikk.tech',
  callbackBaseUrl: 'https://api.island.is',
  isConfigured: true,
}

const paymentFlowConfig: ConfigType<typeof PaymentFlowModuleConfig> = {
  webOrigin: 'https://island.is/greida',
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
  let paymentFlowService: {
    createBankTransferFulfillment: jest.Mock
    createFjsCharge: jest.Mock
    getPaymentFlowDetails: jest.Mock
    getPaymentFlowChargeDetails: jest.Mock
    getPaymentFlowStatus: jest.Mock
    logPaymentFlowUpdate: jest.Mock
  }

  beforeEach(() => {
    logger = createMockLogger()
    bankTransferPaymentModel = {
      update: jest.fn().mockResolvedValue([1]),
      findOne: jest.fn(),
      create: jest.fn().mockResolvedValue({}),
    }
    paymentFlowService = {
      createBankTransferFulfillment: jest.fn().mockResolvedValue(undefined),
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
      getPaymentFlowStatus: jest.fn().mockResolvedValue({
        paymentStatus: PaymentStatus.UNPAID,
        updatedAt: new Date(),
      }),
      logPaymentFlowUpdate: jest.fn().mockResolvedValue(undefined),
    }
    service = new BankTransferService(
      logger,
      config,
      bankTransferPaymentModel as unknown as typeof BankTransferPayment,
      paymentFlowService as unknown as PaymentFlowService,
      paymentFlowConfig,
    )
    fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('createPayment', () => {
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

      const result = await service.createPayment({
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
        service.createPayment({
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
        service.createPayment({
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
      jest.spyOn(service, 'createPayment').mockResolvedValue({
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
      paymentFlowService.getPaymentFlowStatus.mockResolvedValue({
        paymentStatus: PaymentStatus.PAID,
        updatedAt: new Date(),
      })
      const blikkSpy = jest.spyOn(service, 'createPayment')

      await expect(service.create(createInput)).rejects.toThrow(
        PaymentServiceCode.PaymentFlowAlreadyPaid,
      )
      expect(blikkSpy).not.toHaveBeenCalled()
      expect(bankTransferPaymentModel.create).not.toHaveBeenCalled()
    })

    it('throws BankTransferAlreadyInProgress when an active row exists', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        id: 'corr-existing',
        paymentFlowId: 'flow-1',
      })
      const blikkSpy = jest.spyOn(service, 'createPayment')

      await expect(service.create(createInput)).rejects.toThrow(
        BankTransferErrorCode.BankTransferAlreadyInProgress,
      )
      expect(blikkSpy).not.toHaveBeenCalled()
    })

    it('calls Blikk, persists the row, emits payment_started, and returns scaRedirectUrl', async () => {
      const blikkSpy = mockBlikkCreate()

      const result = await service.create(createInput)

      // Provider call gets the correct URLs/amount and a per-attempt correlationId (NOT paymentFlowId).
      expect(blikkSpy).toHaveBeenCalledTimes(1)
      const blikkArg = blikkSpy.mock.calls[0][0]
      expect(blikkArg).toMatchObject({
        paymentFlowId: 'flow-1',
        amount: 14000,
        currency: 'ISK',
        callbackUrl: 'https://api.island.is/v1/payments/bank-transfer/callback',
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

      expect(result).toEqual({
        providerPaymentId: 'prov-1',
        scaRedirectUrl: 'https://blikk/sca',
      })
    })

    it('emits payment_failed and rethrows when Blikk createPayment fails', async () => {
      jest
        .spyOn(service, 'createPayment')
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

  describe('confirmBankTransferPayment', () => {
    const confirmInput = {
      correlationId: 'btp-1',
      paymentFlowId: 'flow-1',
      providerPaymentId: 'prov-1',
      rawStatus: 'SUCCESS',
    }

    it('records the provider status on its own row', async () => {
      await service.confirmBankTransferPayment(confirmInput)

      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { lastKnownStatus: 'SUCCESS' },
        { where: { id: 'btp-1', paymentFlowId: 'flow-1', isDeleted: false } },
      )
    })

    it('passes a transfer charge payload to the fulfillment and notifies upstream', async () => {
      await service.confirmBankTransferPayment(confirmInput)

      expect(paymentFlowService.getPaymentFlowDetails).toHaveBeenCalledWith(
        'flow-1',
      )
      expect(
        paymentFlowService.createBankTransferFulfillment,
      ).toHaveBeenCalledWith(
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
      paymentFlowService.getPaymentFlowStatus.mockResolvedValue({
        paymentStatus: PaymentStatus.PAID,
        updatedAt: new Date(),
      })
      const getPaymentSpy = jest.spyOn(service, 'getPayment')

      const result = await service.verify({ paymentFlowId: 'flow-1' })

      expect(result).toEqual({ status: BankTransferStatus.SUCCESS })
      expect(getPaymentSpy).not.toHaveBeenCalled()
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
    })

    it('calls confirmBankTransferPayment when the provider reports SUCCESS', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(activeRow)
      mockGetPayment(BankTransferStatus.SUCCESS, 'SUCCESS')
      const confirmSpy = jest
        .spyOn(service, 'confirmBankTransferPayment')
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
      'soft-deletes the row and emits payment_failed when the provider reports %s',
      async (status, rawStatus) => {
        bankTransferPaymentModel.findOne.mockResolvedValue(activeRow)
        mockGetPayment(status, rawStatus, 'provider detail')

        const result = await service.verify({ paymentFlowId: 'flow-1' })

        expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
          { isDeleted: true, lastKnownStatus: rawStatus },
          { where: { id: 'corr-1', isDeleted: false } },
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

    it('does not emit payment_failed when the soft-delete affects zero rows (race loser)', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue(activeRow)
      bankTransferPaymentModel.update.mockResolvedValue([0])
      mockGetPayment(BankTransferStatus.ERROR, 'ERROR')

      const result = await service.verify({ paymentFlowId: 'flow-1' })

      expect(bankTransferPaymentModel.update).toHaveBeenCalledTimes(1)
      expect(paymentFlowService.logPaymentFlowUpdate).not.toHaveBeenCalled()
      expect(result.status).toBe(BankTransferStatus.ERROR)
    })

    it('updates lastKnownStatus when the provider returns a different non-terminal status', async () => {
      bankTransferPaymentModel.findOne.mockResolvedValue({
        ...activeRow,
        lastKnownStatus: 'DRAFT',
      })
      mockGetPayment(BankTransferStatus.PENDING, 'SCA_REQUIRED')

      const result = await service.verify({ paymentFlowId: 'flow-1' })

      expect(bankTransferPaymentModel.update).toHaveBeenCalledWith(
        { lastKnownStatus: 'SCA_REQUIRED' },
        { where: { id: 'corr-1', isDeleted: false } },
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
})
