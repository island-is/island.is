import fetch from 'isomorphic-fetch'
import { logger } from '@island.is/logging'
import omit from 'lodash/omit'
import pick from 'lodash/pick'

export const createWrappedFetchWithLogging = (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    fetch(input, init)
      .then(async (response) => {
        let requestBody = init?.body ? JSON.parse(init?.body as string) : {}

        // Filter known sensitive data
        // First pick what we need
        requestBody = pick(requestBody, [
          'adoptionDate',
          // 'applicant',
          'applicationComment',
          'applicationFundId',
          'applicationId',
          'attachments',
          'dateOfBirth',
          // 'email',
          'employers',
          'expectedDateOfBirth',
          'otherParentBlocked',
          // 'otherParentId',
          'paymentInfo',
          'periods',
          // 'phoneNumber',
          'rightsCode',
          'status',
          // 'testData',
        ])
        // Then omit the sensitive sub-attributes
        // requestBody = omit(requestBody, [
        //   'employers.approverNationalRegistryId',
        //   'employers.email',
        //   'paymentInfo.bankAccount',
        // ])
        requestBody.employers = requestBody.employers.map(
          (employer: Init['employers'][number]) => {
            return omit(employer, ['email', 'approverNationalRegistryId'])
          },
        )
        requestBody.paymentInfo = omit(requestBody.paymentInfo, ['bankAccount'])

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
            'errocCode',
          ])
          vmstMetadata.response.body = responseBody
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
