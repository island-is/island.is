import { withAuthContext } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import {
  getEmploymentHistoryEligibility,
  getEmploymentHistoryPreview,
  postEmploymentHistoryRequests,
} from '../../gen/fetch'
import {
  EmploymentCertificateClientNotConfiguredError,
  EmploymentCertificateClientResultMissingError,
} from './employment-certificate.errors'
import type { EmploymentCertificateClientOptions } from './employment-certificate.options'
import { EmploymentCertificateClientService } from './employment-certificate.service'

jest.mock('../../gen/fetch', () => ({
  getEmploymentHistoryEligibility: jest.fn(),
  getEmploymentHistoryPreview: jest.fn(),
  postEmploymentHistoryRequests: jest.fn(),
}))

jest.mock('@island.is/auth-nest-tools', () => ({
  withAuthContext: jest.fn((_user, fn) => fn()),
}))

const getEligibility = getEmploymentHistoryEligibility as jest.Mock
const getPreview = getEmploymentHistoryPreview as jest.Mock
const postRequest = postEmploymentHistoryRequests as jest.Mock

const user = { nationalId: '0101302399' } as User
const options: EmploymentCertificateClientOptions = {
  baseUrl: 'http://localhost:8081/r1/test-service',
  notConfiguredReason: undefined,
  headers: {},
  timeout: 20000,
  autoAuth: undefined,
}

const answer = (data: unknown, status = 200) => ({
  data,
  response: { status },
})

const requestInput = {
  idempotencyKey: 'key-1',
  previewVersion: 'v2:preview-1',
  institutionIds: ['inst-b', 'inst-c'],
  includeUnion: false,
}

describe('EmploymentCertificateClientService', () => {
  const service = new EmploymentCertificateClientService(options)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getEligibility', () => {
    it.each([true, false])(
      'returns hasEmploymentHistory %s in the user context',
      async (hasEmploymentHistory) => {
        getEligibility.mockResolvedValue(answer({ hasEmploymentHistory }))

        await expect(service.getEligibility(user)).resolves.toEqual({
          hasEmploymentHistory,
        })
        expect(withAuthContext).toHaveBeenCalledWith(user, expect.any(Function))
        expect(getEligibility).toHaveBeenCalledWith()
      },
    )

    it.each([undefined, {}, { hasEmploymentHistory: 'yes' }])(
      'fails when the answer has no boolean (%j)',
      async (data) => {
        getEligibility.mockResolvedValue(answer(data))

        await expect(service.getEligibility(user)).rejects.toBeInstanceOf(
          EmploymentCertificateClientResultMissingError,
        )
      },
    )
  })

  describe('getPreview', () => {
    it('returns the institutions and calls the API in the user context', async () => {
      getPreview.mockResolvedValue(
        answer({
          personName: 'Gervimaður Prófunarson',
          previewVersion: 'v2:preview-1',
          institutions: [
            {
              id: 'inst-b',
              name: 'Prófunarstofnun B',
              from: '2025-01-01',
              to: '2025-06-20',
            },
          ],
        }),
      )

      await expect(service.getPreview(user)).resolves.toEqual({
        previewVersion: 'v2:preview-1',
        institutions: [
          {
            id: 'inst-b',
            name: 'Prófunarstofnun B',
            from: '2025-01-01',
            to: '2025-06-20',
          },
        ],
      })
      expect(withAuthContext).toHaveBeenCalledWith(user, expect.any(Function))
      expect(getPreview).toHaveBeenCalledWith()
    })

    it('fills defaults for what the API leaves out', async () => {
      getPreview.mockResolvedValue(
        answer({ previewVersion: 'v2:preview-2', institutions: [{ id: 'x' }] }),
      )

      await expect(service.getPreview(user)).resolves.toEqual({
        previewVersion: 'v2:preview-2',
        institutions: [{ id: 'x', name: '', from: null, to: null }],
      })
    })

    it('returns an empty list for a person without history', async () => {
      getPreview.mockResolvedValue(answer({ previewVersion: 'v2:preview-3' }))

      await expect(service.getPreview(user)).resolves.toEqual({
        previewVersion: 'v2:preview-3',
        institutions: [],
      })
    })

    it.each([undefined, {}, { previewVersion: '' }])(
      'fails when the answer has no previewVersion (%j)',
      async (data) => {
        getPreview.mockResolvedValue(answer(data))

        await expect(service.getPreview(user)).rejects.toBeInstanceOf(
          EmploymentCertificateClientResultMissingError,
        )
      },
    )

    it('fails when an institution has no ID', async () => {
      getPreview.mockResolvedValue(
        answer({
          previewVersion: 'v2:preview-4',
          institutions: [{ name: 'Prófunarstofnun A' }],
        }),
      )

      await expect(service.getPreview(user)).rejects.toBeInstanceOf(
        EmploymentCertificateClientResultMissingError,
      )
    })

    it('lets API errors through', async () => {
      const error = await FetchError.buildMock({ status: 500 })
      getPreview.mockRejectedValue(error)

      await expect(service.getPreview(user)).rejects.toBe(error)
    })
  })

  describe('submitRequest', () => {
    it('sends the choices with the idempotency key', async () => {
      postRequest.mockResolvedValue(
        answer(
          {
            caseId: 'case-1',
            deliveryStatus: 'sent_to_mailbox',
            documentId: 'document-1',
          },
          201,
        ),
      )

      await expect(service.submitRequest(user, requestInput)).resolves.toEqual({
        caseId: 'case-1',
        deliveryStatus: 'sent_to_mailbox',
        documentId: 'document-1',
      })
      expect(withAuthContext).toHaveBeenCalledWith(user, expect.any(Function))
      expect(postRequest).toHaveBeenCalledWith({
        headers: { 'Idempotency-Key': 'key-1' },
        body: {
          previewVersion: 'v2:preview-1',
          institutionIds: ['inst-b', 'inst-c'],
          includeUnion: false,
        },
      })
    })

    it('sends a trimmed comment', async () => {
      postRequest.mockResolvedValue(
        answer({ caseId: 'case-2', deliveryStatus: 'processing' }, 202),
      )

      await service.submitRequest(user, {
        ...requestInput,
        includeUnion: true,
        comment: '  Vantar starf hjá Prófunarstofnun D.  ',
      })

      expect(postRequest.mock.calls[0][0].body).toEqual({
        previewVersion: 'v2:preview-1',
        institutionIds: ['inst-b', 'inst-c'],
        includeUnion: true,
        comment: 'Vantar starf hjá Prófunarstofnun D.',
      })
    })

    it.each([undefined, null, '', '   \n '])(
      'leaves out a blank comment (%j)',
      async (comment) => {
        postRequest.mockResolvedValue(
          answer({ caseId: 'case-3', deliveryStatus: 'processing' }, 202),
        )

        await service.submitRequest(user, { ...requestInput, comment })

        expect(postRequest.mock.calls[0][0].body).not.toHaveProperty('comment')
      },
    )

    it.each(['processing', 'closed'])(
      'returns an accepted request (202 %s) without a document',
      async (deliveryStatus) => {
        postRequest.mockResolvedValue(
          answer({ caseId: 'case-4', deliveryStatus }, 202),
        )

        await expect(
          service.submitRequest(user, requestInput),
        ).resolves.toEqual({
          caseId: 'case-4',
          deliveryStatus,
          documentId: null,
        })
      },
    )

    it('treats a 201 without a status as delivered', async () => {
      postRequest.mockResolvedValue(answer({ caseId: 'case-5' }, 201))

      await expect(
        service.submitRequest(user, requestInput),
      ).resolves.toMatchObject({
        caseId: 'case-5',
        deliveryStatus: 'sent_to_mailbox',
      })
    })

    it('fails on a 202 without a status', async () => {
      postRequest.mockResolvedValue(answer({ caseId: 'case-6' }, 202))

      await expect(
        service.submitRequest(user, requestInput),
      ).rejects.toBeInstanceOf(EmploymentCertificateClientResultMissingError)
    })

    it('fails when the answer has no caseId', async () => {
      postRequest.mockResolvedValue(
        answer({ deliveryStatus: 'sent_to_mailbox' }, 201),
      )

      await expect(
        service.submitRequest(user, requestInput),
      ).rejects.toBeInstanceOf(EmploymentCertificateClientResultMissingError)
    })

    it('lets a 409 through for the caller to map', async () => {
      const error = await FetchError.buildMock({ status: 409 })
      postRequest.mockRejectedValue(error)

      await expect(service.submitRequest(user, requestInput)).rejects.toBe(
        error,
      )
    })
  })

  describe('when the configuration cannot be used', () => {
    const unconfigured = new EmploymentCertificateClientService({
      ...options,
      baseUrl: undefined,
      notConfiguredReason: 'no base URL',
    })

    it('fails every call before any request is made', async () => {
      const calls = [
        unconfigured.getEligibility(user),
        unconfigured.getPreview(user),
        unconfigured.submitRequest(user, requestInput),
      ]

      for (const call of calls) {
        const error = await call.catch((e: unknown) => e)
        expect(error).toBeInstanceOf(
          EmploymentCertificateClientNotConfiguredError,
        )
        expect((error as Error).message).toContain('no base URL')
      }

      expect(withAuthContext).not.toHaveBeenCalled()
      expect(getEligibility).not.toHaveBeenCalled()
      expect(getPreview).not.toHaveBeenCalled()
      expect(postRequest).not.toHaveBeenCalled()
    })
  })
})
