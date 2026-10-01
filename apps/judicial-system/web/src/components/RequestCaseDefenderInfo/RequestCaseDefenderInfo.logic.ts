import { RequestSharedWithDefender } from '@island.is/judicial-system-web/src/graphql/schema'
import type { UpdateCase } from '@island.is/judicial-system-web/src/utils/hooks'

type DefendantWithDefender = {
  id: string
  defenderName?: string | null
}

export const anyDefendantHasDefender = (
  defendants?: DefendantWithDefender[] | null,
) => Boolean(defendants?.some((defendant) => Boolean(defendant.defenderName)))

export const shouldClearRequestSharedWithDefender = ({
  defendants,
  editedDefendantId,
  nextDefenderName,
}: {
  defendants?: DefendantWithDefender[] | null
  editedDefendantId: string
  nextDefenderName?: string | null
}) =>
  !nextDefenderName &&
  !anyDefendantHasDefender(
    defendants?.filter((defendant) => defendant.id !== editedDefendantId),
  )

export const buildCaseDefenderMirrorUpdate = ({
  defenderName,
  defenderNationalId,
  defenderEmail,
  defenderPhoneNumber,
  isCourtUser,
  clearSharing,
}: {
  defenderName: string | null
  defenderNationalId: string | null
  defenderEmail: string | null
  defenderPhoneNumber: string | null
  isCourtUser: boolean
  clearSharing: boolean
}): UpdateCase => ({
  defenderName,
  defenderNationalId,
  defenderEmail,
  defenderPhoneNumber,
  // if court makes any defender changes we default to not share the request
  ...(isCourtUser
    ? { requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED }
    : {}),
  ...(clearSharing ? { requestSharedWithDefender: null } : {}),
  force: true,
})
