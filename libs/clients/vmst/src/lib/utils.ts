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
          logger.info(`vmst-module.success: ${input}`)
        } else {
          const body = await response.json()
          logger.error(`vmst-module.error: ${input}`, body)
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
