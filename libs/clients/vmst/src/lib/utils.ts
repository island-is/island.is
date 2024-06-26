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
