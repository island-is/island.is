import fetch from 'isomorphic-fetch'
import { logger } from '@island.is/logging'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import { ApplicationRights } from '../../gen/fetch'

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
  applicationRights: ApplicationRights[]
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
            body: undefined,
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
          let responseBody = await response.json()
          responseBody = pick(responseBody, [
            'hasError',
            'hasActivePregnancy',
            'errorCode',
            'status',
          ])
          vmstMetadata.response.body = responseBody
          logger.error(`Failed fetching from VMST`, {
            vmst: {
              ...vmstMetadata,
              success: false,
            },
          })
          return reject(responseBody)
        }

        return resolve(response)
      })
      .catch((error) => {
        logger.error(error)
        return reject(error)
      })
  })
}
