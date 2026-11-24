import {
  type CaseState,
  isCompletedCase,
  RequestSharedWithDefender,
} from '@island.is/judicial-system/types'

const REQUEST_SHARED_PERMISSIVENESS: Record<RequestSharedWithDefender, number> =
  {
    [RequestSharedWithDefender.READY_FOR_COURT]: 3,
    [RequestSharedWithDefender.COURT_DATE]: 2,
    [RequestSharedWithDefender.NOT_SHARED]: 1,
  }

type DefendantWithRequestSharing = {
  defenderNationalId?: string | null
  defenderEmail?: string | null
  requestSharedWithDefender?: RequestSharedWithDefender | null
}

const normalizeDefenderEmail = (email?: string | null): string | null => {
  const trimmed = email?.trim()

  if (!trimmed) {
    return null
  }

  return trimmed.toLowerCase()
}

/**
 * Most permissive request-sharing timing among the given values.
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
 * defendants.
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

/**
 * Whether the request of a request case is available to the given defender
 * right now: always once the case is completed, otherwise according to the
 * sharing timing the prosecutor chose. Shared by the request pdf guard and
 * the all-files zip so the two cannot drift apart.
 */
export const isRequestSharedWithDefender = ({
  state,
  defendants,
  nationalId,
  hasArraignmentDate,
}: {
  state: CaseState
  defendants: DefendantWithRequestSharing[] | null | undefined
  nationalId?: string | null
  hasArraignmentDate: boolean
}): boolean => {
  if (isCompletedCase(state)) {
    return true
  }

  const requestSharedWithDefender =
    getMostPermissiveRequestSharedWithDefenderForNationalId(
      defendants,
      nationalId,
    )

  if (requestSharedWithDefender === RequestSharedWithDefender.READY_FOR_COURT) {
    return true
  }

  return (
    requestSharedWithDefender === RequestSharedWithDefender.COURT_DATE &&
    hasArraignmentDate
  )
}

/**
 * Sharing timing for a notification recipient: most permissive among
 * defendants whose defender email matches (case-insensitive). When the
 * recipient has a national id, only those defendants are included. Unlike
 * the national-id helper, this never falls back to every defendant on the
 * case — no match means not shared for that recipient.
 */
export const getMostPermissiveRequestSharedWithDefenderForRecipient = (
  defendants: DefendantWithRequestSharing[] | null | undefined,
  recipient: { email?: string | null; nationalId?: string | null },
): RequestSharedWithDefender | null => {
  if (!defendants?.length) {
    return null
  }

  const normalizedEmail = normalizeDefenderEmail(recipient.email)

  if (normalizedEmail === null) {
    return null
  }

  const nationalId =
    recipient.nationalId !== null &&
    recipient.nationalId !== undefined &&
    recipient.nationalId !== ''
      ? recipient.nationalId
      : undefined

  const matching = defendants.filter((defendant) => {
    if (normalizeDefenderEmail(defendant.defenderEmail) !== normalizedEmail) {
      return false
    }

    if (
      nationalId !== undefined &&
      defendant.defenderNationalId !== nationalId
    ) {
      return false
    }

    return true
  })

  return getMostPermissiveRequestSharedWithDefender(
    matching.map((defendant) => defendant.requestSharedWithDefender),
  )
}
