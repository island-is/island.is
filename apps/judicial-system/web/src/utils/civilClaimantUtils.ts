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

export const isCivilClaimantDefendantSelectionValid = (
  civilClaimant: Pick<CivilClaimant, 'policeCaseNumbers' | 'defendantIds'>,
  defendants: Defendant[],
): boolean => {
  const availableDefendants = getAvailableDefendantsForCivilClaimant(
    civilClaimant,
    defendants,
  )

  if (availableDefendants.length === 0) {
    return true
  }

  const availableIds = new Set(availableDefendants.map((d) => d.id))

  return (civilClaimant.defendantIds ?? []).some((id) => availableIds.has(id))
}
