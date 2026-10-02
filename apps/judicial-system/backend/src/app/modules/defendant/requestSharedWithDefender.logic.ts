import { RequestSharedWithDefender } from '@island.is/judicial-system/types'

const REQUEST_SHARED_PERMISSIVENESS: Record<
  RequestSharedWithDefender,
  number
> = {
  [RequestSharedWithDefender.READY_FOR_COURT]: 3,
  [RequestSharedWithDefender.COURT_DATE]: 2,
  [RequestSharedWithDefender.NOT_SHARED]: 1,
}

/**
 * Most permissive request-sharing timing among defendants that share a
 * defender (or across a case for the case-level dual-write mirror).
 * Order: READY_FOR_COURT > COURT_DATE > NOT_SHARED > null.
 */
export const getMostPermissiveRequestSharedWithDefender = (
  values: Array<RequestSharedWithDefender | null | undefined>,
): RequestSharedWithDefender | null => {
  let best: RequestSharedWithDefender | null = null
  let bestRank = 0

  for (const value of values) {
    if (value === null || value === undefined) {
      continue
    }

    const rank = REQUEST_SHARED_PERMISSIVENESS[value]

    if (rank > bestRank) {
      best = value
      bestRank = rank
    }
  }

  return best
}
