import { logger } from '@island.is/logging'
import { ServiceId } from '../../gen/fetch/xrd-rest'

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
  const codeA = a.serviceCode?.toLowerCase()
  const codeB = b.serviceCode?.toLowerCase()

  if (codeA < codeB) return sortOrder === SortOrder.ASC ? -1 : 1
  else if (codeA > codeB) return sortOrder === SortOrder.ASC ? 1 : -1

  return 0
}

export const exceptionHandler = async (err) => {
  if (err instanceof Response) {
    // Error from X-Road calling getOpenApi
    logger.error(
      `Error calling X-Road Service.\nReturned HTTP status ${err.status} ${
        err.statusText
      }\nMessage: ${await err.text()}`,
    )
  } else {
    logger.error(err)
  }
}
