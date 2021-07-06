import fetch from 'isomorphic-fetch'
import { logger } from '@island.is/logging'

// TODO: Copy paste from VMST client - a really helpful helper

export const createWrappedFetchWithLogging = (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    fetch(input, init)
      .then(async (response) => {
        if (response.ok) {
          logger.info(`drivingLicense-module.success: ${input}`)
        } else {
          const body = await response.json()
          logger.error(`drivingLicense-module.error: ${input}`, body)
          return reject(body)
        }

        return resolve(response)
      })
      .catch((error) => {
        logger.error(`drivingLicense-module.error: ${input}`, error)
        return reject(error)
      })
  })
}
