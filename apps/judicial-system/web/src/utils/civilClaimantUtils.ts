import { CivilClaimant, Defendant } from '@island.is/judicial-system-web/src/graphql/schema'

export const getAvailableDefendantsForCivilClaimant = (
  civilClaimant: Pick<CivilClaimant, 'policeCaseNumbers'>,
  defendants: Defendant[],
): Defendant[] => {
  if (!civilClaimant.policeCaseNumbers?.length) {
    return []
  }

  return defendants.filter((defendant) =>
    defendant.policeCaseNumbers?.some((policeCaseNumber) =>
      civilClaimant.policeCaseNumbers?.includes(policeCaseNumber),
    ),
  )
}

export const isCivilClaimantDefendantSelectionRequired = (
  civilClaimant: Pick<CivilClaimant, 'policeCaseNumbers'>,
  defendants: Defendant[],
): boolean =>
  getAvailableDefendantsForCivilClaimant(civilClaimant, defendants).length > 0

export const isCivilClaimantDefendantSelectionValid = (
  civilClaimant: Pick<CivilClaimant, 'policeCaseNumbers' | 'defendantIds'>,
  defendants: Defendant[],
): boolean => {
  if (!isCivilClaimantDefendantSelectionRequired(civilClaimant, defendants)) {
    return true
  }

  return (civilClaimant.defendantIds?.length ?? 0) > 0
}
