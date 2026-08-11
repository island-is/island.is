import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { useAuth } from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { PrimarySchoolClientService } from '@island.is/clients/mms/primary-school'
import { AuditService } from '@island.is/nest/audit'
import { GatewayTimeout } from '@island.is/nest/problem'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { setup } from '../../../../test/setup'
import { EducationDocumentsConfig } from './education-document.config'

const EDUCATION_SCOPE = '@island.is/education'
const ENDPOINT = '/education/primary-school/student1/result/result1/pdf'
const ENDPOINT_V2 = '/education/primary-school/student1/result/result1/pdf-v2'
const TEST_TIMEOUT_MS = 50

const fakePdfClient = { getAssignmentResultPdf: jest.fn() }
const fakeAudit = { audit: jest.fn() }
const fakeLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
  child: jest.fn().mockReturnThis(),
}

const fakePdfBlob = () =>
  new Blob([Buffer.from('%PDF-1.4 fake')], { type: 'application/pdf' })

let app: INestApplication

beforeAll(async () => {
  app = await setup({
    hooks: [
      useAuth({
        auth: createCurrentUser({
          nationalId: '1234567890',
          scope: [EDUCATION_SCOPE],
        }),
      }),
    ],
    override: (builder) =>
      builder
        .overrideProvider(PrimarySchoolClientService)
        .useValue(fakePdfClient)
        .overrideProvider(AuditService)
        .useValue(fakeAudit)
        .overrideProvider(LOGGER_PROVIDER)
        .useValue(fakeLogger)
        .overrideProvider(EducationDocumentsConfig.KEY)
        .useValue({ primarySchoolPdfTimeoutMs: TEST_TIMEOUT_MS }),
  })
})

afterAll(async () => {
  await app.close()
})

afterEach(() => {
  jest.clearAllMocks()
})

const post = () => request(app.getHttpServer()).post(ENDPOINT_V2).send({})
const postCurrent = () => request(app.getHttpServer()).post(ENDPOINT).send({})

describe('EducationController — getPrimarySchoolAssignmentResultPdf (current)', () => {
  it('returns a 200 with correct headers on success', async () => {
    fakePdfClient.getAssignmentResultPdf.mockResolvedValue(fakePdfBlob())

    const res = await postCurrent()

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('application/pdf')
    expect(res.headers['content-disposition']).toContain(
      '1234567890-namsmat-result1.pdf',
    )
  })

  it('returns a 404 when the blob is missing', async () => {
    fakePdfClient.getAssignmentResultPdf.mockResolvedValue(null)

    const res = await postCurrent()

    expect(res.status).toBe(404)
  })

  it('returns a 500 and logs when the client throws', async () => {
    fakePdfClient.getAssignmentResultPdf.mockRejectedValue(new Error('boom'))

    const res = await postCurrent()

    expect(res.status).toBe(500)
    expect(fakeLogger.error).toHaveBeenCalled()
  })

  it('calls audit exactly once on success, never on failure', async () => {
    fakePdfClient.getAssignmentResultPdf.mockResolvedValue(fakePdfBlob())
    await postCurrent()
    expect(fakeAudit.audit).toHaveBeenCalledTimes(1)

    jest.clearAllMocks()
    fakePdfClient.getAssignmentResultPdf.mockRejectedValue(new Error('boom'))
    await postCurrent()
    expect(fakeAudit.audit).not.toHaveBeenCalled()
  })

  it('does not pass an AbortSignal to the client', async () => {
    fakePdfClient.getAssignmentResultPdf.mockResolvedValue(fakePdfBlob())

    await postCurrent()

    expect(
      fakePdfClient.getAssignmentResultPdf.mock.calls[0][3],
    ).toBeUndefined()
  })
})

describe('EducationController — getPrimarySchoolAssignmentResultPdfV2', () => {
  it('logs that it is serving the request', async () => {
    fakePdfClient.getAssignmentResultPdf.mockResolvedValue(fakePdfBlob())

    await post()

    expect(fakeLogger.debug).toHaveBeenCalledWith(
      'Serving primary school assignment result PDF request',
      expect.objectContaining({
        studentId: 'student1',
        assignmentResultId: 'result1',
      }),
    )
  })

  it('returns a 200 with correct headers on success (StreamableFile)', async () => {
    fakePdfClient.getAssignmentResultPdf.mockResolvedValue(fakePdfBlob())

    const res = await post()

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('application/pdf')
    expect(res.headers['content-disposition']).toContain('namsmat-result1.pdf')
    expect(res.headers['content-disposition']).not.toContain('1234567890')
    expect(res.headers['x-content-type-options']).toBe('nosniff')
  })

  it('maps a null blob to a 404 problem+json response', async () => {
    fakePdfClient.getAssignmentResultPdf.mockResolvedValue(null)

    const res = await post()

    expect(res.status).toBe(404)
    expect(res.headers['content-type']).toContain('application/problem+json')
  })

  it('lets a client error propagate untouched to ProblemModule, resulting in a 500 problem+json response', async () => {
    const timeoutError = Object.assign(new Error('network timeout'), {
      name: 'FetchError',
      type: 'request-timeout',
    })
    fakePdfClient.getAssignmentResultPdf.mockRejectedValue(timeoutError)

    const res = await post()

    expect(res.status).toBe(500)
    expect(res.headers['content-type']).toContain('application/problem+json')
  })

  it('logs the exact same error object the client threw, unwrapped, via the structured logger', async () => {
    const original = new Error('boom')
    fakePdfClient.getAssignmentResultPdf.mockRejectedValue(original)

    await post()

    expect(fakeLogger.error).toHaveBeenCalled()
    const loggedError = fakeLogger.error.mock.calls[0][0]
    expect(loggedError).toBe(original)
  })

  it('calls audit exactly once on success, never on failure', async () => {
    fakePdfClient.getAssignmentResultPdf.mockResolvedValue(fakePdfBlob())
    await post()
    expect(fakeAudit.audit).toHaveBeenCalledTimes(1)

    jest.clearAllMocks()
    fakePdfClient.getAssignmentResultPdf.mockRejectedValue(new Error('boom'))
    await post()
    expect(fakeAudit.audit).not.toHaveBeenCalled()
  })

  it('passes a real AbortSignal through to the client, derived from the configured timeout', async () => {
    fakePdfClient.getAssignmentResultPdf.mockResolvedValue(fakePdfBlob())

    await post()

    const signal = fakePdfClient.getAssignmentResultPdf.mock.calls[0][3]
    expect(signal).toBeInstanceOf(AbortSignal)
    expect(signal.aborted).toBe(false)
  })

  it('rethrows a client AbortError as a GatewayTimeout naming the configured timeout, resulting in a 504 problem+json response', async () => {
    const abortError = Object.assign(new Error('The user aborted a request.'), {
      name: 'AbortError',
    })
    fakePdfClient.getAssignmentResultPdf.mockRejectedValue(abortError)

    const res = await post()

    expect(res.status).toBe(504)
    expect(res.headers['content-type']).toContain('application/problem+json')
    expect(fakeLogger.error).toHaveBeenCalled()
    const loggedError = fakeLogger.error.mock.calls[0][0]
    expect(loggedError).toBeInstanceOf(GatewayTimeout)
    expect(loggedError.message).toContain(String(TEST_TIMEOUT_MS))
  })
})
