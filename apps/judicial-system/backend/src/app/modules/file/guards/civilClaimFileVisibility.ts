import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import { CaseFileCategory } from '@island.is/judicial-system/types'

import { CivilClaimant, Defendant } from '../../repository'

/**
 * Whether a defender (identified by their national id) may view a civil claim
 * case file. Matches {@link CaseInterceptor} filtering for defence users.
 *
 * Legacy files: no civilClaimantId or claimant without LÖKE numbers → visible
 * to any defender who already passes category-level checks.
 */
export const canDefenceUserViewCivilClaimCaseFile = (
  defenderUserNationalId: string,
  args: {
    category?: CaseFileCategory
    civilClaimantId?: string | null
    defendants?: Defendant[]
    civilClaimants?: CivilClaimant[]
  },
): boolean => {
  if (!args.category || args.category !== CaseFileCategory.CIVIL_CLAIM) {
    return true
  }

  if (!args.civilClaimantId) {
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
