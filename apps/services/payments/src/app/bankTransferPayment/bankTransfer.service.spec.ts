import { ConfigType } from '@nestjs/config'
import { BadRequestException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { BankTransferErrorCode } from '@island.is/shared/constants'

import { BankTransferStatus } from './bankTransfer.types'
import { BankTransferService } from './bankTransfer.service'
import { BankTransferModuleConfig } from './bankTransfer.config'

const config: ConfigType<typeof BankTransferModuleConfig> = {
  apiKey: 'test-key',
  baseUrl: 'https://stage.blikk.tech',
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

  beforeEach(() => {
    logger = createMockLogger()
    service = new BankTransferService(logger, config)
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
      expect(body.sourceReferenceId).toBe('flow-1')
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
})
