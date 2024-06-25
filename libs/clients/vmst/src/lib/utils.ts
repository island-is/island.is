import fetch from 'isomorphic-fetch'
import { logger } from '@island.is/logging'
import omit from 'lodash/omit'
import pick from 'lodash/pick'

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
    email: string
    nationalRegistryId: string
    approverNationalRegistryId: string
  }[]
  status: string
  rightsCode: string
  attachments: number
  testData: string
  otherParentBlocked: boolean
}

export const createWrappedFetchWithLogging = (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    fetch(input, init)
      .then(async (response) => {
        let requestBody = init?.body ? JSON.parse(init?.body as string) : {}
        let responseBody = await response.json().catch((error) => {
          logger.error('Error parsing JSON from response', {
            error: error.message,
          })
        })

        // Filter known sensitive data
        // TODO: Should pick what we need instead
        requestBody = omit(requestBody, [
          'applicant',
          'otherParentId',
          'email',
          'phoneNumber',
          'paymentInfo.bankAccount',
          'employers.email',
          'employers.approverNationalRegistryId',
        ])
        responseBody = pick(responseBody, [
          'hasError',
          'hasActivePregnancy',
          'errocCode',
        ])

        const vmstMetadata = {
          request: {
            body: requestBody,
          },
          response: {
            status_text: response.statusText,
            body: responseBody,
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
          logger.error(`Failed fetching from VMST`, {
            vmst: {
              ...vmstMetadata,
              success: false,
            },
          })
          return reject(requestBody)
        }

        return resolve(response)
      })
      .catch((error) => {
        logger.error(error)
        return reject(error)
      })
  })
}
