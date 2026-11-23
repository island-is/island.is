import type { ApplicationWithAttachments } from '@island.is/application/types'
import type { User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import type { AuditService } from '@island.is/nest/audit'
import {
  DeliveryStatus,
  employmentCertificateErrors as errors,
} from '@island.is/application/templates/fjs/employment-certificate'
import {
  EmploymentCertificateClientNotConfiguredError,
  EmploymentCertificateClientResultMissingError,
} from '@island.is/clients/fjs/employment-certificate'
import type { EmploymentCertificateClientService } from '@island.is/clients/fjs/employment-certificate'
import { FetchError } from '@island.is/clients/middlewares'
import { TemplateApiError } from '@island.is/nest/problem'
import { EmploymentCertificateService } from './employment-certificate.service'

const auth = {
  nationalId: '0101302399',
  authorization: 'Bearer test-token',
} as User

const COMMENT = 'Vantar starf hjá Prófunarstofnun D, sjá 0101302399.'

const baseAnswers = {
  previewVersion: 'v2:preview-1',
  institutionIds: ['inst-b', 'inst-c'],
}

const applicationWith = (
  answers: Record<string, unknown> = {},
): ApplicationWithAttachments =>
  ({
    id: '6f3a2b1c-0000-4000-8000-000000000000',
    state: 'draft',
    externalData: {},
    answers: { ...baseAnswers, ...answers },
  } as unknown as ApplicationWithAttachments)

const expectTemplateApiError = async (
  promise: Promise<unknown>,
  status: number,
) => {
  const error = await promise.catch((e: unknown) => e)
  expect(error).toBeInstanceOf(TemplateApiError)
  expect((error as TemplateApiError).problem.status).toBe(status)
  return error as TemplateApiError
}

const errorReasonOf = (error: TemplateApiError) =>
  (error.problem as unknown as { errorReason: unknown }).errorReason

const apiError = (status: number, code?: string) =>
  FetchError.buildMock(
    { status, headers: { 'content-type': 'application/json' } },
    JSON.stringify({
      ...(code && { code }),
      error: 'free text from the API',
      requestId: 'request-1',
    }),
  )

const timeoutError = () => Object.assign(new Error(), { name: 'AbortError' })

describe('EmploymentCertificateService', () => {
  const info = jest.fn()
  const warn = jest.fn()
  const error = jest.fn()
  const logger = { info, warn, error } as unknown as Logger
  const audit = jest.fn()
  const auditService = { audit } as unknown as AuditService
  const getEligibility = jest.fn()
  const getPreview = jest.fn()
  const submitRequest = jest.fn()
  const client = {
    getEligibility,
    getPreview,
    submitRequest,
  } as unknown as EmploymentCertificateClientService
  const service = new EmploymentCertificateService(logger, client, auditService)
  const props = (application = applicationWith()) => ({
    application,
    auth,
    currentUserLocale: 'is' as const,
  })

  const everythingLogged = () =>
    JSON.stringify([
      ...info.mock.calls,
      ...warn.mock.calls,
      ...error.mock.calls,
      ...audit.mock.calls,
    ])

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getEmploymentEligibility', () => {
    it('asks the API as the applicant and lets them continue', async () => {
      getEligibility.mockResolvedValue({ hasEmploymentHistory: true })

      await expect(service.getEmploymentEligibility(props())).resolves.toEqual({
        hasEmploymentHistory: true,
      })
      expect(getEligibility).toHaveBeenCalledWith(auth)
    })

    it('blocks the applicant without history', async () => {
      getEligibility.mockResolvedValue({ hasEmploymentHistory: false })

      const e = await expectTemplateApiError(
        service.getEmploymentEligibility(props()),
        400,
      )
      expect(errorReasonOf(e)).toEqual({
        title: errors.noHistoryTitle,
        summary: errors.noHistorySummary,
      })
    })
  })

  describe('getEmploymentHistoryPreview', () => {
    it('returns the history from the API, fetched as the applicant', async () => {
      const preview = {
        previewVersion: 'v2:preview-1',
        institutions: [
          {
            id: 'inst-a',
            name: 'Prófunarstofnun A',
            from: '2024-01-01',
            to: null,
          },
        ],
      }
      getPreview.mockResolvedValue(preview)

      await expect(
        service.getEmploymentHistoryPreview(props()),
      ).resolves.toEqual(preview)
      expect(getPreview).toHaveBeenCalledWith(auth)
    })
  })

  describe.each([
    [
      'eligibility',
      () => service.getEmploymentEligibility(props()),
      getEligibility,
    ],
    ['preview', () => service.getEmploymentHistoryPreview(props()), getPreview],
  ])('when the %s call fails', (operation, call, clientCall) => {
    it.each([401, 500])(
      'fails with 502 when the API answers %i',
      async (status) => {
        clientCall.mockRejectedValue(await apiError(status))

        const e = await expectTemplateApiError(call(), 502)
        expect(errorReasonOf(e)).toEqual({
          title: errors.unavailableTitle,
          summary: errors.unavailableSummary,
        })
      },
    )

    it('fails with 502 when the API sends an unusable answer', async () => {
      clientCall.mockRejectedValue(
        new EmploymentCertificateClientResultMissingError(operation, 'field'),
      )

      await expectTemplateApiError(call(), 502)
    })

    it.each([
      [
        'the client is not configured',
        () => new EmploymentCertificateClientNotConfiguredError('no base URL'),
      ],
      ['the call times out', timeoutError],
    ])('fails with 503 when %s', async (_name, buildError) => {
      clientCall.mockRejectedValue(buildError())

      await expectTemplateApiError(call(), 503)
    })

    it('logs only IDs and codes', async () => {
      clientCall.mockRejectedValue(await apiError(401))

      await call().catch(() => undefined)

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0][1]).toEqual({
        operation,
        applicationId: applicationWith().id,
        status: 401,
        code: undefined,
        requestId: 'request-1',
        errorName: 'FetchError',
        errorMessage: undefined,
      })
      expect(everythingLogged()).not.toContain('free text')
      expect(everythingLogged()).not.toContain('test-token')
      expect(everythingLogged()).not.toContain(auth.nationalId)
    })
  })

  it('logs why the client could not be used', async () => {
    getPreview.mockRejectedValue(
      new EmploymentCertificateClientNotConfiguredError('no base URL'),
    )

    await service.getEmploymentHistoryPreview(props()).catch(() => undefined)

    expect(warn.mock.calls[0][1]).toMatchObject({
      operation: 'preview',
      errorName: 'EmploymentCertificateClientNotConfiguredError',
      errorMessage:
        'The employment certificate client is not configured: no base URL',
    })
  })

  describe('submitApplication', () => {
    const delivered = {
      caseId: 'case-1',
      deliveryStatus: 'sent_to_mailbox',
      documentId: 'document-1',
    }

    it('sends the answers with the application ID as the idempotency key', async () => {
      submitRequest.mockResolvedValue(delivered)

      await service.submitApplication(props())

      expect(submitRequest).toHaveBeenCalledWith(auth, {
        idempotencyKey: applicationWith().id,
        previewVersion: 'v2:preview-1',
        institutionIds: ['inst-b', 'inst-c'],
        includeUnion: false,
      })
    })

    it('reuses the same key on every retry', async () => {
      submitRequest
        .mockRejectedValueOnce(await apiError(500))
        .mockResolvedValueOnce(delivered)

      await service.submitApplication(props()).catch(() => undefined)
      await service.submitApplication(props())

      const keys = submitRequest.mock.calls.map(
        ([, input]) => input.idempotencyKey,
      )
      expect(keys).toEqual([applicationWith().id, applicationWith().id])
    })

    it('sends the union choice and the trimmed comment', async () => {
      submitRequest.mockResolvedValue(delivered)

      await service.submitApplication(
        props(
          applicationWith({ includeUnion: ['yes'], comment: `  ${COMMENT}  ` }),
        ),
      )

      expect(submitRequest.mock.calls[0][1]).toMatchObject({
        includeUnion: true,
        comment: COMMENT,
      })
    })

    it('leaves a blank comment out', async () => {
      submitRequest.mockResolvedValue(delivered)

      await service.submitApplication(
        props(applicationWith({ comment: '   ' })),
      )

      expect(submitRequest.mock.calls[0][1]).not.toHaveProperty('comment')
    })

    it.each([
      ['no preview version', { previewVersion: undefined }],
      ['no ticked institution', { institutionIds: [] }],
    ])(
      'fails with 400 without calling the API when there is %s',
      async (_name, answers) => {
        await expectTemplateApiError(
          service.submitApplication(props(applicationWith(answers))),
          400,
        )
        expect(submitRequest).not.toHaveBeenCalled()
      },
    )

    it.each([
      [
        delivered,
        {
          caseId: 'case-1',
          deliveryStatus: DeliveryStatus.SENT_TO_MAILBOX,
          documentId: 'document-1',
        },
      ],
      [
        { caseId: 'case-2', deliveryStatus: 'processing', documentId: null },
        {
          caseId: 'case-2',
          deliveryStatus: DeliveryStatus.PROCESSING,
          documentId: null,
        },
      ],
      [
        { caseId: 'case-3', deliveryStatus: 'closed', documentId: null },
        {
          caseId: 'case-3',
          deliveryStatus: DeliveryStatus.CLOSED,
          documentId: null,
        },
      ],
      [
        { caseId: 'case-4', deliveryStatus: 'something_new', documentId: null },
        {
          caseId: 'case-4',
          deliveryStatus: DeliveryStatus.PROCESSING,
          documentId: null,
        },
      ],
    ])('stores the case from %j', async (answer, stored) => {
      submitRequest.mockResolvedValue(answer)

      await expect(service.submitApplication(props())).resolves.toEqual(stored)
    })

    it('audits and logs the case without the comment', async () => {
      submitRequest.mockResolvedValue(delivered)

      await service.submitApplication(
        props(applicationWith({ comment: COMMENT })),
      )

      expect(audit).toHaveBeenCalledWith({
        auth,
        action: 'requestEmploymentCertificate',
        resources: applicationWith().id,
        meta: { caseId: 'case-1', deliveryStatus: 'sent_to_mailbox' },
      })
      expect(info).toHaveBeenCalledWith('Employment certificate requested', {
        applicationId: applicationWith().id,
        caseId: 'case-1',
        deliveryStatus: 'sent_to_mailbox',
      })
      expect(everythingLogged()).not.toContain('Prófunarstofnun D')
    })

    it('fails with 409 when the history changed, so the applicant can check it again', async () => {
      submitRequest.mockRejectedValue(await apiError(409, 'preview_changed'))

      const e = await expectTemplateApiError(
        service.submitApplication(props()),
        409,
      )

      expect(errorReasonOf(e)).toEqual({
        title: errors.previewChangedTitle,
        summary: errors.previewChangedSummary,
      })
      expect(audit).not.toHaveBeenCalled()
      expect(warn).not.toHaveBeenCalled()
      expect(error).not.toHaveBeenCalled()
    })

    it('fails with 502 and logs an error on a 409 without a code', async () => {
      submitRequest.mockRejectedValue(await apiError(409))

      const e = await expectTemplateApiError(
        service.submitApplication(props()),
        502,
      )

      expect(errorReasonOf(e)).toEqual({
        title: errors.submitFailedTitle,
        summary: errors.submitFailedSummary,
      })
      expect(error.mock.calls[0][1]).toMatchObject({
        operation: 'submit',
        status: 409,
        code: undefined,
        requestId: 'request-1',
      })
    })

    it.each([400, 404, 413, 500])(
      'fails with 502 when the API answers %i',
      async (status) => {
        submitRequest.mockRejectedValue(await apiError(status))

        await expectTemplateApiError(service.submitApplication(props()), 502)
        expect(warn.mock.calls[0][1]).toMatchObject({
          operation: 'submit',
          status,
        })
        expect(audit).not.toHaveBeenCalled()
      },
    )

    it.each([
      [
        'the client is not configured',
        () => new EmploymentCertificateClientNotConfiguredError('no base URL'),
      ],
      ['the call times out', timeoutError],
    ])('fails with 503 when %s', async (_name, buildError) => {
      submitRequest.mockRejectedValue(buildError())

      const e = await expectTemplateApiError(
        service.submitApplication(props()),
        503,
      )
      expect(errorReasonOf(e)).toEqual({
        title: errors.submitFailedTitle,
        summary: errors.submitFailedSummary,
      })
    })
  })
})
