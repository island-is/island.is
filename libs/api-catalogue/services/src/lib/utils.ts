import { logger } from '@island.is/logging'
import { FetchError } from '@island.is/clients/middlewares'
import { ServiceId } from '../../gen/fetch/xrd-rest'

const SEPERATOR = '-'

export enum SortOrder {
  ASC,
  DESC,
}

/**
 * Sort function for @type {ServiceId}
 * @param a
 * @param b
 * @param sort Enum for which order to sort the items in
 * @returns When sort is ascending:
 *          negative number if a < b
 *          positive number if a > b
 *
 *          When sort is descending:
 *          negative number if a > b
 *          positive number if a < b
 *
 *          In both cases:
 *          0 if a == b
 */
export const serviceIdSort = (
  a: ServiceId,
  b: ServiceId,
  sortOrder: SortOrder = SortOrder.ASC,
): number => {
  const codeA = a.serviceCode?.toLowerCase() ?? ''
  const codeB = b.serviceCode?.toLowerCase() ?? ''

  if (codeA < codeB) return sortOrder === SortOrder.ASC ? -1 : 1
  else if (codeA > codeB) return sortOrder === SortOrder.ASC ? 1 : -1

  return 0
}

/**
 * Checks if the serviceCode is a valid pattern.
 * @param serviceCode Should be in the following formats:
 *                    - petstore-v1
 *                    - petstore-v2
 *                    - amazing-petstore-v1
 *                    - amazing-petstore-v2
 * @returns true if it is valid, otherwise false.
 */
const isValidServiceCodeWithVersion = (serviceCode: string) => {
  const regExp = new RegExp('^v[0-9]+(.[0-9]+){0,2}$')

  if (serviceCode) {
    const splits = serviceCode.split(SEPERATOR)

    if (splits && splits.length > 1 && regExp.test(splits[splits.length - 1])) {
      return true
    }
  }

  return false
}

/**
 * Parses version number from the X-Road serviceCode.
 *
 * @param serviceCode Should be in the following formats:
 *                    - petstore-v1
 *                    - petstore-v2
 *                    - amazing-petstore-v1
 *                    - amazing-petstore-v2
 * @returns The string that is the last segment when split by '-'
 *          If '-' is not found then returns the serviceCode unparsed.
 */
export const parseVersionNumber = (serviceCode: string) => {
  if (isValidServiceCodeWithVersion(serviceCode)) {
    return serviceCode.split(SEPERATOR).splice(-1, 1)[0]
  }
  return serviceCode
}

/**
 * Parses the serviceCode from the X-Road serviceCode to
 * strip away the version number.
 *
 * @param serviceCode Should be in the following formats:
 *                    - petstore-v1
 *                    - petstore-v2
 *                    - amazing-petstore-v1
 *                    - amazing-petstore-v2
 * @returns The string without the last segment after the last '-'
 */
export const parseServiceCode = (serviceCode: string) => {
  if (isValidServiceCodeWithVersion(serviceCode)) {
    const splits = serviceCode.split(SEPERATOR)
    splits.splice(-1, 1)
    return splits.join(SEPERATOR)
  }
  return serviceCode
}

export const exceptionHandler = (err: unknown) => {
  if (err instanceof FetchError) {
    // Error from X-Road calling getOpenApi
    logger.warn(
      `Error calling X-Road Service.\nReturned HTTP status ${err.status} ${err.statusText}`,
      { body: err.body, problem: err.problem },
    )
  } else {
    logger.error('Unexpected error calling X-Road Service', err)
  }
}
