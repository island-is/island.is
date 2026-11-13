import request from 'supertest'
import { INestApplication } from '@nestjs/common'

import { EstatesClientService } from '@island.is/clients/estates'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { AuditService } from '@island.is/nest/audit'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { GatewayTimeout } from '@island.is/nest/problem'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { useAuth } from '@island.is/testing/nest'

import { setup } from '../../../../test/setup'

const ESTATES_SCOPE = '@island.is/estates'
const DOCUMENT_ID = 'doc1'
const ENDPOINT = `/estates/document/${DOCUMENT_ID}`

const fakeEstatesClient = { getDocument: jest.fn() }
const fakeAudit = { audit: jest.fn() }
const fakeLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
  child: jest.fn().mockReturnThis(),
}
const fakeFeatureFlagService = { getValue: jest.fn().mockResolvedValue(true) }

const fakeDocument = () => ({
  fileName: 'erfdaskra.pdf',
  documentContentBase64: Buffer.from('%PDF-1.4 fake').toString('base64'),
})

let app: INestApplication

beforeAll(async () => {
  app = await setup({
    hooks: [
      useAuth({
        auth: createCurrentUser({
          nationalId: '1234567890',
          scope: [ESTATES_SCOPE],
        }),
      }),
    ],
    override: (builder) =>
      builder
        .overrideProvider(EstatesClientService)
        .useValue(fakeEstatesClient)
        .overrideProvider(AuditService)
        .useValue(fakeAudit)
        .overrideProvider(LOGGER_PROVIDER)
        .useValue(fakeLogger)
        .overrideProvider(FeatureFlagService)
        .useValue(fakeFeatureFlagService),
  })
})

afterAll(async () => {
  await app.close()
})

afterEach(() => {
  jest.clearAllMocks()
})

const post = () => request(app.getHttpServer()).post(ENDPOINT).send({})

describe('EstatesDocumentsController — getEstateDocumentPdf', () => {
  it('logs that it is serving the request', async () => {
    fakeEstatesClient.getDocument.mockResolvedValue(fakeDocument())

    await post()

    expect(fakeLogger.debug).toHaveBeenCalledWith(
      'Serving estate document request',
      expect.objectContaining({ documentId: DOCUMENT_ID }),
    )
  })

  it('returns a 200 with correct headers on success (StreamableFile)', async () => {
    fakeEstatesClient.getDocument.mockResolvedValue(fakeDocument())

    const res = await post()

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('application/pdf')
    expect(res.headers['content-disposition']).toContain(
      `danarbu-skjal-${DOCUMENT_ID}.pdf`,
    )
    expect(res.headers['content-disposition']).not.toContain('1234567890')
    expect(res.headers['x-content-type-options']).toBe('nosniff')
  })

  it('maps a null document to a 404 problem+json response', async () => {
    fakeEstatesClient.getDocument.mockResolvedValue(null)

    const res = await post()

    expect(res.status).toBe(404)
    expect(res.headers['content-type']).toContain('application/problem+json')
  })

  it('maps an empty documentContentBase64 to a 404 problem+json response', async () => {
    fakeEstatesClient.getDocument.mockResolvedValue({
      fileName: 'erfdaskra.pdf',
      documentContentBase64: '',
    })

    const res = await post()

    expect(res.status).toBe(404)
    expect(res.headers['content-type']).toContain('application/problem+json')
  })

  it('lets a client error propagate untouched to ProblemModule, resulting in a 500 problem+json response', async () => {
    fakeEstatesClient.getDocument.mockRejectedValue(new Error('boom'))

    const res = await post()

    expect(res.status).toBe(500)
    expect(res.headers['content-type']).toContain('application/problem+json')
  })

  it('calls audit exactly once on success, never on failure', async () => {
    fakeEstatesClient.getDocument.mockResolvedValue(fakeDocument())
    await post()
    expect(fakeAudit.audit).toHaveBeenCalledTimes(1)

    jest.clearAllMocks()
    fakeEstatesClient.getDocument.mockRejectedValue(new Error('boom'))
    await post()
    expect(fakeAudit.audit).not.toHaveBeenCalled()
  })

  it('passes a real AbortSignal through to the client', async () => {
    fakeEstatesClient.getDocument.mockResolvedValue(fakeDocument())

    await post()

    const signal = fakeEstatesClient.getDocument.mock.calls[0][2]
    expect(signal).toBeInstanceOf(AbortSignal)
    expect(signal.aborted).toBe(false)
  })

  it('maps a client rejection that aborted the signal to a GatewayTimeout, resulting in a 504 problem+json response', async () => {
    const controller = new AbortController()
    const timeoutSpy = jest
      .spyOn(AbortSignal, 'timeout')
      .mockReturnValue(controller.signal)
    const timeoutError = Object.assign(new Error('The operation was aborted'), {
      name: 'TimeoutError',
    })
    fakeEstatesClient.getDocument.mockImplementation(
      (_user, _documentId, signal: AbortSignal) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(timeoutError), {
            once: true,
          })
          controller.abort()
        }),
    )

    const res = await post()
    timeoutSpy.mockRestore()

    expect(res.status).toBe(504)
    expect(res.headers['content-type']).toContain('application/problem+json')
    expect(fakeLogger.error).toHaveBeenCalled()
    const loggedError = fakeLogger.error.mock.calls[0][0]
    expect(loggedError).toBeInstanceOf(GatewayTimeout)
    expect(loggedError.message).toContain('19000')
  })
})
