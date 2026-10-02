import type { ConfigType } from '@island.is/nest/config'
import { createEnhancedFetch, FetchError } from '@island.is/clients/middlewares'

import type { CreateDirectDebtorPaymentReqBody } from '../../gen/fetch'
import { BlikkClientConfig } from './blikkClient.config'
import { BlikkClientModule } from './blikkClient.module'
import { BlikkClientService } from './blikkClient.service'
import { BlikkClientError } from './blikkClient.types'

// The module wires the generated client to the enhanced fetch; swap that for a mock so the tests
// observe the exact Request the generated client sends.
const mockFetch = jest.fn()
jest.mock('@island.is/clients/middlewares', () => ({
  ...jest.requireActual('@island.is/clients/middlewares'),
  createEnhancedFetch: jest.fn(() => mockFetch),
}))

const config: ConfigType<typeof BlikkClientConfig> = {
  apiKey: 'test-key',
  basePath: 'https://stage.blikk.tech',
  fetchTimeout: 10000,
  isConfigured: true,
}

const okResponse = (json: unknown) =>
  new Response(JSON.stringify(json), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })

const sentRequest = (): Request => mockFetch.mock.calls[0][0]

// A FetchError carrying a status, as the enhanced fetch raises for non-2xx responses. The enhanced
// fetch captures the error body into `body` (parsed JSON, or text for non-JSON responses).
// FetchError's constructor is private, so build the instance via its prototype.
const fetchErrorWithStatus = (
  status: number,
  body?: string | object,
): FetchError => {
  const error = Object.create(FetchError.prototype) as FetchError
  Object.assign(error, {
    status,
    statusText: 'Error',
    message: `Request failed with status code ${status}`,
    body,
  })
  return error
}

describe('BlikkClientService', () => {
  let service: BlikkClientService

  beforeAll(() => {
    new BlikkClientModule(config)
  })

  beforeEach(() => {
    mockFetch.mockReset()
    service = new BlikkClientService()
  })

  it('configures the enhanced fetch with the client name and timeout', () => {
    expect(createEnhancedFetch).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'clients-blikk', timeout: 10000 }),
    )
  })

  describe('createPayment', () => {
    const body: CreateDirectDebtorPaymentReqBody = {
      amount: 14000,
      currency: 'ISK',
      sourceReferenceId: 'corr-1',
      callbackUrl: 'https://island.is/greida/api/bank-transfer/callback',
      expiresAt: 1700000000,
      items: [{ name: 'Vegabréf', quantity: 1, unitPrice: '14000' }],
      debtorExternalId: '1234567890',
      debtorName: '1234567890',
      debtorBban: '0133-26-012345',
    }

    it('POSTs to /ecom/v3/payments/direct-debtor with the API-Key header and returns the response', async () => {
      mockFetch.mockResolvedValue(
        okResponse({ id: 'prov-1', status: 'PENDING' }),
      )

      const result = await service.createPayment(body)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const request = sentRequest()
      expect(request.url).toBe(
        'https://stage.blikk.tech/ecom/v3/payments/direct-debtor',
      )
      expect(request.method).toBe('POST')
      expect(request.headers.get('API-Key')).toBe('test-key')
      expect(request.headers.get('Content-Type')).toBe('application/json')
      expect(await request.json()).toEqual(body)
      expect(result).toEqual({ id: 'prov-1', status: 'PENDING' })
    })

    it('sends integer amounts and timestamps as JSON numbers', async () => {
      mockFetch.mockResolvedValue(
        okResponse({ id: 'prov-1', status: 'PENDING' }),
      )

      await service.createPayment(body)

      const sent = await sentRequest().json()
      expect(sent.amount).toBe(14000)
      expect(sent.expiresAt).toBe(1700000000)
      expect(sent.items[0].quantity).toBe(1)
    })

    it('throws BlikkClientError carrying the HTTP status on a non-2xx', async () => {
      mockFetch.mockRejectedValue(fetchErrorWithStatus(400))

      await expect(service.createPayment(body)).rejects.toMatchObject({
        name: 'BlikkClientError',
        status: 400,
      })
    })

    // The enhanced fetch logs the failure and full body itself; the client only converts the error
    // and folds Blikk's Problem Details `detail` into the message for callers to log with context.
    it('puts Blikk’s Problem Details detail into the error message on a non-2xx JSON body', async () => {
      mockFetch.mockRejectedValue(
        fetchErrorWithStatus(403, {
          type: 'about:blank',
          title: 'Forbidden',
          status: 403,
          detail: 'sales channel does not allow direct debtor payments',
        }),
      )

      await expect(service.createPayment(body)).rejects.toMatchObject({
        name: 'BlikkClientError',
        status: 403,
        message:
          'Blikk request failed (403): sales channel does not allow direct debtor payments',
      })
    })

    it('reads detail from the problem the enhanced fetch parsed for application/problem+json', async () => {
      const fetchError = fetchErrorWithStatus(400)
      fetchError.problem = {
        status: 400,
        title: 'Bad Request',
        detail: 'debtor bban is required',
      } as FetchError['problem']
      mockFetch.mockRejectedValue(fetchError)

      await expect(service.createPayment(body)).rejects.toMatchObject({
        status: 400,
        message: 'Blikk request failed (400): debtor bban is required',
      })
    })

    it('keeps the generic message when the error body is not Problem Details', async () => {
      mockFetch.mockRejectedValue(
        fetchErrorWithStatus(404, '404 page not found'),
      )

      await expect(service.createPayment(body)).rejects.toMatchObject({
        name: 'BlikkClientError',
        status: 404,
        message: 'Request failed with status code 404',
      })
    })

    it('keeps the generic message when no body was captured', async () => {
      mockFetch.mockRejectedValue(fetchErrorWithStatus(502))

      await expect(service.createPayment(body)).rejects.toMatchObject({
        name: 'BlikkClientError',
        status: 502,
        message: 'Request failed with status code 502',
      })
    })

    it('throws BlikkClientError (no status) on a network failure', async () => {
      mockFetch.mockRejectedValue(new Error('socket hang up'))

      const error = await service.createPayment(body).catch((e) => e)
      expect(error).toBeInstanceOf(BlikkClientError)
      expect(error.status).toBeUndefined()
      expect(error.message).toBe('socket hang up')
    })
  })

  describe('getPayment', () => {
    it('GETs /ecom/v3/payments/{id} (URL-encoded) and returns the response', async () => {
      mockFetch.mockResolvedValue(
        okResponse({ id: 'prov 1', status: 'SUCCESS' }),
      )

      const result = await service.getPayment('prov 1')

      const request = sentRequest()
      expect(request.url).toBe(
        'https://stage.blikk.tech/ecom/v3/payments/prov%201',
      )
      expect(request.method).toBe('GET')
      expect(request.headers.get('API-Key')).toBe('test-key')
      expect(result).toEqual({ id: 'prov 1', status: 'SUCCESS' })
    })

    it('throws BlikkClientError with status on a non-2xx', async () => {
      mockFetch.mockRejectedValue(fetchErrorWithStatus(404))

      await expect(service.getPayment('prov-1')).rejects.toMatchObject({
        name: 'BlikkClientError',
        status: 404,
      })
    })
  })

  describe('cancelPayment', () => {
    it('POSTs /ecom/v3/payments/cancel/{id} with the required body and resolves on success', async () => {
      mockFetch.mockResolvedValue(okResponse({ message: 'cancelled' }))

      await expect(service.cancelPayment('prov-1')).resolves.toBeUndefined()

      const request = sentRequest()
      expect(request.url).toBe(
        'https://stage.blikk.tech/ecom/v3/payments/cancel/prov-1',
      )
      expect(request.method).toBe('POST')
      // Blikk declares the request body as required.
      expect(await request.json()).toEqual({
        cancelMessage: 'Cancelled by payer',
      })
    })

    it('throws BlikkClientError carrying the HTTP status (e.g. 409 for a live payment)', async () => {
      mockFetch.mockRejectedValue(fetchErrorWithStatus(409))

      await expect(service.cancelPayment('prov-1')).rejects.toMatchObject({
        name: 'BlikkClientError',
        status: 409,
      })
    })
  })
})
