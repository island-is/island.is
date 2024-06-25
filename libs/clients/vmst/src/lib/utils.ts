import fetch from 'isomorphic-fetch'
import { logger } from '@island.is/logging'

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
  employers: [
    {
      email: string
      nationalRegistryId: string
      approverNationalRegistryId: string
    },
  ]
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
        const body: Partial<Init> = init?.body
          ? JSON.parse(init?.body as string)
          : {}

        // Filter known sensitive data
        // NOTE: Should only select what we need, not expand the entire object

        const foo = {
          adoptionDate: '',
          applicationId: 'uuidv4',
          applicationFundId: '',
          applicant: 'hidden',
          otherParentId: '',
          expectedDateOfBirth: '1970-01-01',
          dateOfBirth: '',
          email: 'hidden',
          phoneNumber: 'hidden',
          paymentInfo: {
            bankAccount: 'hidden',
            personalAllowance: 0,
            personalAllowanceFromSpouse: 0,
            union: { id: 'Secret', name: '' },
            pensionFund: { id: 'Secret', name: '' },
            privatePensionFund: { id: 'Secret', name: '' },
            privatePensionFundRatio: 0,
          },
          periods: [
            {
              from: '2024-01-01',
              to: '2024-01-01',
              ratio: '100',
              approved: false,
              paid: false,
              rightsCodePeriod: 'Secret',
            },
          ],
          applicationComment: '',
          employers: [
            {
              email: 'secret@email.tld',
              nationalRegistryId: '1234567890',
              approverNationalRegistryId: '--MASKED--',
            },
          ],
          status: 'In Progress',
          rightsCode: 'Secret',
          attachments: 0,
          testData: 'false',
          otherParentBlocked: false,
        }
        const {
          adoptionDate,
          applicationId,
          applicationFundId,
          applicant,
          otherParentId,
          expectedDateOfBirth,
          dateOfBirth,
          email,
          phoneNumber,
          paymentInfo,
          periods,
          applicationComment,
          employers,
          status,
          rightsCode,
          attachments,
          testData,
          otherParentBlocked,
        } = body
        const metaAttributes = {
          adoptionDate,
          applicationId,
          applicationFundId,
          applicant,
          otherParentId,
          expectedDateOfBirth,
          dateOfBirth,
          email,
          phoneNumber,
          paymentInfo,
          periods,
          applicationComment,
          employers,
          status,
          rightsCode,
          attachments,
          testData,
          otherParentBlocked,
        }

        if (response.ok) {
          logger.info(
            `vmst-module.success: input - ${JSON.stringify(
              input,
            )}, init - ${JSON.stringify(init)}`,
            {
              vmst_module: {
                success: true,
                metaAttributes,
              },
            },
          )
        } else {
          const body = await response.json()
          logger.error(
            `vmst-module.error: input - ${JSON.stringify(
              input,
            )}, init - ${JSON.stringify(init)}, response - ${JSON.stringify(
              body,
            )} status text: ${response.statusText}`,
            {
              vmst: {
                success: false,
                metaAttributes,
              },
            },
          )
          return reject(body)
        }

        return resolve(response)
      })
      .catch((error) => {
        logger.error(error)
        return reject(error)
      })
  })
}
