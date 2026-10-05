import { RequestSharedWithDefender } from '@island.is/judicial-system/types'

const REQUEST_SHARED_PERMISSIVENESS: Record<
  RequestSharedWithDefender,
  number
> = {
  [RequestSharedWithDefender.READY_FOR_COURT]: 3,
  [RequestSharedWithDefender.COURT_DATE]: 2,
  [RequestSharedWithDefender.NOT_SHARED]: 1,
}

type DefendantWithRequestSharing = {
  defenderNationalId?: string | null
  requestSharedWithDefender?: RequestSharedWithDefender | null
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

/**
 * Sharing timing for a defender national id: most permissive among the
 * defendants they represent. If they match nobody (e.g. prison staff peeking
 * at limited-access fields), fall back to most permissive across all
 * defendants — same signal the case-level dual-write mirror carries.
 */
export const getMostPermissiveRequestSharedWithDefenderForNationalId = (
  defendants: DefendantWithRequestSharing[] | null | undefined,
  nationalId?: string | null,
): RequestSharedWithDefender | null => {
  if (!defendants?.length) {
    return null
  }

  const matching =
    nationalId !== null && nationalId !== undefined && nationalId !== ''
      ? defendants.filter(
          (defendant) => defendant.defenderNationalId === nationalId,
        )
      : []

  const source = matching.length > 0 ? matching : defendants

  return getMostPermissiveRequestSharedWithDefender(
    source.map((defendant) => defendant.requestSharedWithDefender),
  )
}
