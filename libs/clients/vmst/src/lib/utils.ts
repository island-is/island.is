import fetch from 'isomorphic-fetch'
import { logger } from '@island.is/logging'

export const createWrappedFetchWithLogging = (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    fetch(input, init)
      .then(async (response) => {
        const body = init?.body ? JSON.parse(init?.body as string) : {}

        const newInit = {
          ...init,
          body: {
            ...body,
            applicant: 'hidden',
            otherParentId: '' ?? 'hidden',
            email: 'hidden',
            phoneNumber: 'hidden',
            paymentInfo: {
              ...body?.paymentInfo,
              bankAccount: 'hidden',
            },
            attachments: body?.attachments?.length,
          },
        }
        if (response.ok) {
          logger.info(
            `vmst-module.success: input - ${JSON.stringify(
              input,
            )}, init - ${JSON.stringify(newInit)}`,
          )
        } else {
          const body = await response.json()
          logger.error(
            `vmst-module.error: input - ${JSON.stringify(
              input,
            )}, init - ${JSON.stringify(newInit)}, response - ${JSON.stringify(
              body,
            )} status text: ${response.statusText}`,
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
