import fetch from 'isomorphic-fetch'
import { logger } from '@island.is/logging'

export const createWrappedFetchWithLogging = (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    fetch(input, init)
      .then(async (response) => {
        if (response.ok) {
          logger.info(
            `skilavottord-module.success: input - ${JSON.stringify(
              input,
            )}, init - ${JSON.stringify(init)}`,
          )
        } else {
          const body = await response.json()
          logger.error(
            `skilavottord-module.error: input - ${JSON.stringify(
              input,
            )}, init - ${JSON.stringify(init)}, response - ${JSON.stringify(
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
