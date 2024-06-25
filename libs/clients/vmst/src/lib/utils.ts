import fetch from 'isomorphic-fetch'
import { logger } from '@island.is/logging'

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
        requestBody = {
          ...requestBody,
          applicant: undefined,
          otherParentId: undefined,
          email: undefined,
          phoneNumber: undefined,
          paymentInfo: {
            ...requestBody?.paymentInfo,
            bankAccount: undefined,
          },
          attachments: requestBody?.attachments?.length,
          employers: requestBody?.employers?.map(
            (
              employer: Init['employers'][0],
            ): Partial<Init['employers'][0]> => ({
              ...employer,
              email: undefined,
              approverNationalRegistryId: undefined,
            }),
          ),
        }
        const { hasError, hasActivePregnancy, errocCode } = responseBody
        responseBody = { hasError, hasActivePregnancy, errocCode }

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
