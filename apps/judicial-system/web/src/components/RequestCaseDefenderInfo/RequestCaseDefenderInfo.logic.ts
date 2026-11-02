import { isCompletedCase } from '@island.is/judicial-system/types'
import {
  CaseState,
  RequestSharedWithDefender,
} from '@island.is/judicial-system-web/src/graphql/schema'
type DefendantWithDefender = {
  id: string
  defenderName?: string | null
  defenderNationalId?: string | null
  requestSharedWithDefender?: RequestSharedWithDefender | null
}

const REQUEST_SHARED_PERMISSIVENESS: Record<RequestSharedWithDefender, number> =
  {
    [RequestSharedWithDefender.READY_FOR_COURT]: 3,
    [RequestSharedWithDefender.COURT_DATE]: 2,
    [RequestSharedWithDefender.NOT_SHARED]: 1,
  }

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

// Sharing for the logged-in defender only — never fall back to other
// defendants' timing, so the UI cannot offer a request download the API
// would reject.
export const getRequestSharedWithDefenderForNationalId = (
  defendants: DefendantWithDefender[] | null | undefined,
  nationalId?: string | null,
): RequestSharedWithDefender | null => {
  if (
    !defendants?.length ||
    nationalId === null ||
    nationalId === undefined ||
    nationalId === ''
  ) {
    return null
  }

  return getMostPermissiveRequestSharedWithDefender(
    defendants
      .filter((defendant) => defendant.defenderNationalId === nationalId)
      .map((defendant) => defendant.requestSharedWithDefender),
  )
}

export const canDefenderViewRequest = ({
  defendants,
  nationalId,
  state,
  hasArraignmentDate,
}: {
  defendants?: DefendantWithDefender[] | null
  nationalId?: string | null
  state?: CaseState | null
  hasArraignmentDate: boolean
}): boolean => {
  const requestSharedWithDefender = getRequestSharedWithDefenderForNationalId(
    defendants,
    nationalId,
  )

  if (!requestSharedWithDefender || !state) {
    return false
  }

  if (requestSharedWithDefender === RequestSharedWithDefender.READY_FOR_COURT) {
    return (
      state === CaseState.SUBMITTED ||
      state === CaseState.RECEIVED ||
      isCompletedCase(state)
    )
  }

  if (requestSharedWithDefender === RequestSharedWithDefender.COURT_DATE) {
    return (
      (state === CaseState.RECEIVED || isCompletedCase(state)) &&
      hasArraignmentDate
    )
  }

  // NOT_SHARED: request is only visible once the case is completed
  return isCompletedCase(state)
}

export const anyDefendantHasDefender = (
  defendants?: DefendantWithDefender[] | null,
) => Boolean(defendants?.some((defendant) => Boolean(defendant.defenderName)))

export const getRequestCaseDefenderNames = (
  defendants?: DefendantWithDefender[] | null,
) => {
  const names: string[] = []

  defendants?.forEach(({ defenderName }) => {
    if (defenderName && !names.includes(defenderName)) {
      names.push(defenderName)
    }
  })

  return names
}

export const isRequestSharingDecidedForAllDefenders = (
  defendants?: DefendantWithDefender[] | null,
) =>
  (defendants ?? []).every(
    (defendant) =>
      !defendant.defenderName || Boolean(defendant.requestSharedWithDefender),
  )

export const getDefendantRequestSharingUpdate = ({
  isCourtUser,
  nextDefenderName,
}: {
  isCourtUser: boolean
  nextDefenderName?: string | null
}): { requestSharedWithDefender?: RequestSharedWithDefender | null } => {
  if (!nextDefenderName) {
    return { requestSharedWithDefender: null }
  }

  // if court makes any defender changes we default to not share the request
  if (isCourtUser) {
    return { requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED }
  }

  return {}
}
