import fetch from 'isomorphic-fetch'
import { logger } from '@island.is/logging'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import { ApplicationRight } from '../../gen/fetch'

// A parental leave request body:
type Init = {
  adoptionDate: string
  applicationId: string
  applicationFundId: string
  applicant: string
  otherParentId: string
  expectedDateOfBirth: string
  dateOfBirth: string
  email: string
  phoneNumber: string
  paymentInfo: {
    bankAccount: string
    personalAllowance: number
    personalAllowanceFromSpouse: number
    union: { id: string; name: string }
    pensionFund: { id: string; name: string }
    privatePensionFund: { id: string; name: string }
    privatePensionFundRatio: number
  }
  periods: [
    {
      from: string
      to: string
      ratio: string
      approved: boolean
      paid: boolean
      rightsCodePeriod: string
    },
  ]
  applicationComment: string
  employers: {
    email?: string // Modified to be optional
    nationalRegistryId: string
    approverNationalRegistryId?: string // Modified to be optional
  }[]
  status: string
  rightsCode: string
  attachments: {
    attachmentBytes: string
    attachmentType: string
  }[]
  testData: string
  otherParentBlocked: boolean
  applicationRights: ApplicationRight[]
}

const MAX_REASON_LENGTH = 300

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseJson = (text: string): unknown => {
  if (!text) {
    return undefined
  }
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

const collapse = (text: string): string => {
  const collapsed = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return collapsed.length > MAX_REASON_LENGTH
    ? `${collapsed.slice(0, MAX_REASON_LENGTH)}…`
    : collapsed
}

/**
 * Pull a human-readable reason out of a VMST error body: the known fields of a
 * JSON body (including ASP.NET ProblemDetails field errors), or the raw text
 * when the body is not JSON (e.g. an HTML 500 from X-Road).
 */
const describeErrorBody = (parsed: unknown, rawBody: string): string => {
  if (isRecord(parsed)) {
    const parts: string[] = []
    for (const key of ['errorCode', 'title', 'detail', 'message']) {
      const value = parsed[key]
      if (typeof value === 'string' && value) {
        parts.push(value)
      }
    }
    if (isRecord(parsed.errors)) {
      for (const [field, messages] of Object.entries(parsed.errors)) {
        const text = Array.isArray(messages)
          ? messages.join(', ')
          : String(messages)
        parts.push(`${field}: ${text}`)
      }
    }
    if (parts.length > 0) {
      return collapse(parts.join('; '))
    }
  }

  return collapse(rawBody)
}

export const createWrappedFetchWithLogging = (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    fetch(input, init)
      .then(async (response) => {
        // Filter known sensitive data
        // First pick what we need
        const requestBody = pick(
          (init?.body ? JSON.parse(init?.body as string) : {}) as Partial<Init>,
          [
            'adoptionDate',
            // 'applicant',
            // 'applicationComment',
            'applicationFundId',
            'applicationId',
            // 'attachments',
            'dateOfBirth',
            // 'email',
            'employers',
            'expectedDateOfBirth',
            'otherParentBlocked',
            // 'otherParentId',
            // 'paymentInfo',
            'periods',
            // 'phoneNumber',
            // 'rightsCode',
            // 'status',
            'testData',
            'applicationRights',
          ],
        )
        // Then omit the sensitive sub-attributes
        // requestBody = omit(requestBody, [
        //   'employers.approverNationalRegistryId',
        //   'employers.email',
        //   'paymentInfo.bankAccount',
        // ])
        requestBody.employers = requestBody.employers?.map(
          (employer: Init['employers'][number]) => {
            return omit(employer, ['email', 'approverNationalRegistryId'])
          },
        )

        const vmstMetadata = {
          request: {
            body: requestBody,
          },
          response: {
            status_text: response.statusText,
            body: undefined as Record<string, unknown> | undefined,
          },
        }

        if (response.ok) {
          logger.info(`Successfully fetched from VMST`, {
            vmst: {
              ...vmstMetadata,
              success: true,
            },
          })
        } else {
          const rawBody = await response.text().catch(() => '')
          const parsedBody = parseJson(rawBody)
          const responseBody = isRecord(parsedBody)
            ? pick(parsedBody, [
                'hasError',
                'hasActivePregnancy',
                'errorCode',
                'status',
              ])
            : undefined
          vmstMetadata.response.body = responseBody
          logger.error(`Failed fetching from VMST`, {
            vmst: {
              ...vmstMetadata,
              success: false,
            },
          })
          // Previously rejected with `requestBody`, which handed callers back
          // their own request as the "error". Reject with a real Error so the
          // response fields are what surfaces upstream.
          const reason = describeErrorBody(parsedBody, rawBody)
          return reject(
            Object.assign(
              new Error(
                reason
                  ? `${response.status} ${response.statusText}: ${reason}`
                  : `${response.status} ${response.statusText}`,
              ),
              {
                name: 'VmstError',
                status: response.status,
                statusText: response.statusText,
                body: responseBody,
              },
            ),
          )
        }

        return resolve(response)
      })
      .catch((error) => {
        logger.error(error)
        return reject(error)
      })
  })
}
