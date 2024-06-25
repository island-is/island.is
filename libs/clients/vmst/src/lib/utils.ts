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

        // Filter known sensitive data
        // NOTE: Should only select what we need, not expand the entire object
        init = init?.body
          ? {
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
          : init
        if (response.ok) {
          logger.info(
            `vmst-module.success: input - ${JSON.stringify(
              input,
            )}, init - ${JSON.stringify(init)}`,
            {
              vmst_module: {
                success: true,
              },
              input, // Should filter what we know we want
              init, // Should filter what we know we want
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
              vmst_module: {
                success: false,
                error: true,
              },
              input, // Should filter what we know we want
              init, // Should filter what we know we want
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
