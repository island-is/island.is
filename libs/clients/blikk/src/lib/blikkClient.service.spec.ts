import type { ConfigType } from '@island.is/nest/config'
import type { Logger } from '@island.is/logging'
import { EnhancedFetchAPI, FetchError } from '@island.is/clients/middlewares'

import { BlikkClientConfig } from './blikkClient.config'
import { BlikkClientService } from './blikkClient.service'
import {
  BlikkClientError,
  CreateBlikkPaymentRequest,
} from './blikkClient.types'

const config: ConfigType<typeof BlikkClientConfig> = {
  apiKey: 'test-key',
  basePath: 'https://stage.blikk.tech',
  fetchTimeout: 10000,
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

const okResponse = (json: unknown) =>
  ({ json: jest.fn().mockResolvedValue(json) } as unknown as Response)

// A FetchError carrying a status, as the enhanced fetch raises for non-2xx responses.
// FetchError's constructor is private, so build the instance via its prototype.
const fetchErrorWithStatus = (status: number): FetchError => {
  const error = Object.create(FetchError.prototype) as FetchError
  Object.assign(error, {
    status,
    message: `Request failed with status code ${status}`,
  })
  return error
}

describe('BlikkClientService', () => {
  let fetchMock: jest.Mock
  let service: BlikkClientService

  beforeEach(() => {
    fetchMock = jest.fn()
    service = new BlikkClientService(
      config,
      fetchMock as unknown as EnhancedFetchAPI,
      createMockLogger(),
    )
  })

  describe('createPayment', () => {
    const body: CreateBlikkPaymentRequest = {
      amount: 14000,
      currency: 'ISK',
      sourceReferenceId: 'corr-1',
      callbackUrl: 'https://island.is/greida/api/bank-transfer/callback',
      expiresAt: 1700000000,
      items: [{ name: 'Vegabréf', quantity: 1, unitPrice: '14000' }],
    }

    it('POSTs to /ecom/v3/payments with the API-Key header and returns the parsed response', async () => {
      fetchMock.mockResolvedValue(
        okResponse({ id: 'prov-1', status: 'PENDING' }),
      )

      const result = await service.createPayment(body)

      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [url, options] = fetchMock.mock.calls[0]
      expect(url).toBe('https://stage.blikk.tech/ecom/v3/payments')
      expect(options.method).toBe('POST')
      expect(options.headers['API-Key']).toBe('test-key')
      expect(options.headers['Content-Type']).toBe('application/json')
      expect(JSON.parse(options.body)).toMatchObject({
        amount: 14000,
        currency: 'ISK',
        sourceReferenceId: 'corr-1',
      })
      expect(result).toEqual({ id: 'prov-1', status: 'PENDING' })
    })

    it('throws BlikkClientError carrying the HTTP status on a non-2xx', async () => {
      fetchMock.mockRejectedValue(fetchErrorWithStatus(400))

      await expect(service.createPayment(body)).rejects.toMatchObject({
        name: 'BlikkClientError',
        status: 400,
      })
    })

    it('throws BlikkClientError (no status) on a network failure', async () => {
      fetchMock.mockRejectedValue(new Error('ECONNRESET'))

      const error = await service.createPayment(body).catch((e) => e)
      expect(error).toBeInstanceOf(BlikkClientError)
      expect(error.status).toBeUndefined()
    })

    it('throws BlikkClientError when the response body fails schema validation', async () => {
      fetchMock.mockResolvedValue(okResponse({ unexpected: true }))

      await expect(service.createPayment(body)).rejects.toBeInstanceOf(
        BlikkClientError,
      )
    })
  })

  describe('getPayment', () => {
    it('GETs /ecom/v3/payments/{id} (URL-encoded) and returns the parsed response', async () => {
      fetchMock.mockResolvedValue(
        okResponse({ id: 'prov 1', status: 'SUCCESS' }),
      )

      const result = await service.getPayment('prov 1')

      const [url, options] = fetchMock.mock.calls[0]
      expect(url).toBe('https://stage.blikk.tech/ecom/v3/payments/prov%201')
      expect(options.method).toBe('GET')
      expect(options.headers['API-Key']).toBe('test-key')
      expect(result).toEqual({ id: 'prov 1', status: 'SUCCESS' })
    })

    it('throws BlikkClientError with status on a non-2xx', async () => {
      fetchMock.mockRejectedValue(fetchErrorWithStatus(404))

      await expect(service.getPayment('prov-1')).rejects.toMatchObject({
        name: 'BlikkClientError',
        status: 404,
      })
    })
  })

  describe('cancelPayment', () => {
    it('DELETEs /ecom/v3/payments/{id} and resolves on success', async () => {
      fetchMock.mockResolvedValue(okResponse({}))

      await expect(service.cancelPayment('prov-1')).resolves.toBeUndefined()

      const [url, options] = fetchMock.mock.calls[0]
      expect(url).toBe('https://stage.blikk.tech/ecom/v3/payments/prov-1')
      expect(options.method).toBe('DELETE')
    })

    it('throws BlikkClientError carrying the HTTP status (e.g. 409 for a live payment)', async () => {
      fetchMock.mockRejectedValue(fetchErrorWithStatus(409))

      await expect(service.cancelPayment('prov-1')).rejects.toMatchObject({
        name: 'BlikkClientError',
        status: 409,
      })
    })
  })
})
