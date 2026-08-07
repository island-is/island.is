import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { useAuth } from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { PrimarySchoolClientService } from '@island.is/clients/mms/primary-school'
import { AuditService } from '@island.is/nest/audit'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { setup } from '../../../../test/setup'

const EDUCATION_SCOPE = '@island.is/education'
const ENDPOINT = '/education/primary-school/student1/result/result1/pdf'

const fakePdfClient = { getAssignmentResultPdf: jest.fn() }
const fakeAudit = { audit: jest.fn() }
const fakeLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
  child: jest.fn().mockReturnThis(),
}

const flagState = {
  implementation: 'current' as 'old' | 'current' | 'new',
  simulateFailure: false,
}
const fakeFeatureFlagService = {
  getValue: jest.fn((feature: Features) => {
    if (
      feature === Features.downloadServiceMmsPrimarySchoolImplementationTest
    ) {
      return Promise.resolve(flagState.implementation)
    }
    if (feature === Features.downloadServiceSimulateMmsPrimarySchoolFailure) {
      return Promise.resolve(flagState.simulateFailure)
    }
    return Promise.resolve(false)
  }),
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
        .overrideProvider(FeatureFlagService)
        .useValue(fakeFeatureFlagService)
        .overrideProvider(LOGGER_PROVIDER)
        .useValue(fakeLogger),
  })
})

afterAll(async () => {
  await app.close()
})

afterEach(() => {
  jest.clearAllMocks()
  flagState.implementation = 'current'
  flagState.simulateFailure = false
})

const post = () => request(app.getHttpServer()).post(ENDPOINT).send({})

describe('EducationController — getPrimarySchoolAssignmentResultPdf', () => {
  it.each(['old', 'current', 'new'] as const)(
    'logs which implementation is serving the request (%s)',
    async (implementation) => {
      flagState.implementation = implementation
      fakePdfClient.getAssignmentResultPdf.mockResolvedValue(fakePdfBlob())

      await post()

      expect(fakeLogger.info).toHaveBeenCalledWith(
        'Serving primary school assignment result PDF request',
        expect.objectContaining({
          implementation,
          studentId: 'student1',
          assignmentResultId: 'result1',
        }),
      )
    },
  )

  describe("implementation: 'current' (default, today's real code)", () => {
    beforeEach(() => {
      flagState.implementation = 'current'
    })

    it('returns 200 with the PDF buffer and headers on success', async () => {
      fakePdfClient.getAssignmentResultPdf.mockResolvedValue(fakePdfBlob())

      const res = await post()

      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toContain('application/pdf')
      expect(res.headers['content-disposition']).toContain(
        'namsmat-result1.pdf',
      )
    })

    it('returns 404 when the client resolves null', async () => {
      fakePdfClient.getAssignmentResultPdf.mockResolvedValue(null)
      await post().expect(404)
    })

    it('returns a blanket 500 and logs via the structured logger on any client error', async () => {
      fakePdfClient.getAssignmentResultPdf.mockRejectedValue(new Error('boom'))

      const res = await post()

      expect(res.status).toBe(500)
      expect(fakeLogger.error).toHaveBeenCalledWith(
        'Failed to get primary school assignment result PDF',
        expect.objectContaining({ assignmentResultId: 'result1' }),
      )
    })
  })

  describe("implementation: 'old' (pre-#22820, no catch)", () => {
    beforeEach(() => {
      flagState.implementation = 'old'
    })

    it('still returns 200 on success', async () => {
      fakePdfClient.getAssignmentResultPdf.mockResolvedValue(fakePdfBlob())
      await post().expect(200)
    })

    it('a raw client error is still caught by ProblemModule at the app boundary (app-wide fix applies regardless of variant)', async () => {
      fakePdfClient.getAssignmentResultPdf.mockRejectedValue(new Error('boom'))

      const res = await post()

      expect(res.status).toBe(500)
      expect(res.headers['content-type']).toContain('application/problem+json')
      expect(fakeLogger.error).toHaveBeenCalled()
    })
  })

  describe("implementation: 'new' (target design)", () => {
    beforeEach(() => {
      flagState.implementation = 'new'
    })

    it('returns a 200 with correct headers on success (StreamableFile)', async () => {
      fakePdfClient.getAssignmentResultPdf.mockResolvedValue(fakePdfBlob())

      const res = await post()

      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toContain('application/pdf')
      expect(res.headers['content-disposition']).toContain(
        'namsmat-result1.pdf',
      )
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
  })

  describe('simulate-failure flag (Features.downloadServiceSimulateMmsPrimarySchoolFailure)', () => {
    let randomSpy: jest.SpyInstance

    beforeEach(() => {
      flagState.simulateFailure = true
    })

    afterEach(() => {
      randomSpy?.mockRestore()
    })

    describe("scenario coverage (implementation: 'new')", () => {
      beforeEach(() => {
        flagState.implementation = 'new'
      })

      it.each([0, 1, 2, 3, 4, 5])(
        'logs an info line naming the simulated scenario at index %i, never calls the real client',
        async (index) => {
          randomSpy = jest.spyOn(Math, 'random').mockReturnValue(index / 6)

          const res = await post()

          expect(fakePdfClient.getAssignmentResultPdf).not.toHaveBeenCalled()
          expect(fakeLogger.info).toHaveBeenCalledWith(
            'Simulating MMS primary-school PDF failure',
            expect.objectContaining({ scenario: expect.any(String) }),
          )
          // All simulated scenarios are plain Error/FetchError-shaped objects
          // (not thrown Nest HttpExceptions), so ErrorFilter catches every one
          // and flattens it to 500 — matches the "propagate raw" design.
          expect(res.status).toBe(500)
        },
      )
    })

    describe('applies to every implementation variant, not just the new one', () => {
      it.each(['old', 'current', 'new'] as const)(
        'never calls the real client and returns a 500 for implementation: %s',
        async (implementation) => {
          flagState.implementation = implementation

          const res = await post()

          expect(fakePdfClient.getAssignmentResultPdf).not.toHaveBeenCalled()
          expect(fakeLogger.info).toHaveBeenCalledWith(
            'Simulating MMS primary-school PDF failure',
            expect.objectContaining({
              scenario: expect.any(String),
              studentId: 'student1',
              assignmentResultId: 'result1',
            }),
          )
          expect(res.status).toBe(500)

          if (implementation === 'current') {
            // Caught by the 'current' variant's own manual catch block.
            expect(fakeLogger.error).toHaveBeenCalledWith(
              'Failed to get primary school assignment result PDF',
              expect.objectContaining({ assignmentResultId: 'result1' }),
            )
          } else {
            // 'old' and 'new' both let it propagate uncaught to ProblemModule.
            expect(res.headers['content-type']).toContain(
              'application/problem+json',
            )
          }
        },
      )
    })
  })
})
