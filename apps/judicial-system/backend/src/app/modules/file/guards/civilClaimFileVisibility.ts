import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import { CaseFileCategory } from '@island.is/judicial-system/types'

import { CivilClaimant, Defendant } from '../../repository'

export const canDefenceUserViewCivilClaimCaseFile = (
  defenderUserNationalId: string | undefined,
  args: {
    category?: CaseFileCategory
    civilClaimantId?: string | null
    defendants?: Defendant[]
    civilClaimants?: CivilClaimant[]
  },
): boolean => {
  if (!defenderUserNationalId) {
    return false
  }

  if (
    !args.civilClaimantId ||
    !args.category ||
    args.category !== CaseFileCategory.CIVIL_CLAIM
  ) {
    return true
  }

  const claimant = args.civilClaimants?.find(
    (c) => c.id === args.civilClaimantId,
  )

  if (!claimant?.policeCaseNumbers?.length) {
    return true
  }

  return (
    args.defendants?.some(
      (defendant) =>
        defendant.isDefenderChoiceConfirmed &&
        defendant.defenderNationalId &&
        normalizeAndFormatNationalId(defenderUserNationalId).includes(
          defendant.defenderNationalId,
        ) &&
        defendant.policeCaseNumbers?.some((pcn) =>
          claimant.policeCaseNumbers?.includes(pcn),
        ),
    ) ?? false
  )
}
