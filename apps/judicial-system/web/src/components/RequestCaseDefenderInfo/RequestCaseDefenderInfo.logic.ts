import { RequestSharedWithDefender } from '@island.is/judicial-system-web/src/graphql/schema'
import type { UpdateCase } from '@island.is/judicial-system-web/src/utils/hooks'

type DefendantWithDefender = {
  id: string
  defenderName?: string | null
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
  defendants?:
    | (DefendantWithDefender & {
        requestSharedWithDefender?: RequestSharedWithDefender | null
      })[]
    | null,
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

// The case-level sharing timing is left out on purpose: the server keeps it as
// the most permissive value across the defendants, and a case-level write
// would be copied onto every defendant.
export const buildCaseDefenderMirrorUpdate = ({
  defenderName,
  defenderNationalId,
  defenderEmail,
  defenderPhoneNumber,
}: {
  defenderName: string | null
  defenderNationalId: string | null
  defenderEmail: string | null
  defenderPhoneNumber: string | null
}): UpdateCase => ({
  defenderName,
  defenderNationalId,
  defenderEmail,
  defenderPhoneNumber,
  force: true,
})
