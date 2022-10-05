import { formatIndividualDto, IndividualDto } from './individual.dto'
import { Fjolskyldumedlimir } from '../../../gen/fetch'

export interface FamilyDto {
  familyId: string
  individuals: IndividualDto[]
}

export function formatFamilyDto(
  family: Fjolskyldumedlimir | null,
): FamilyDto | null {
  if (family == null || family.fjolskyldunumer == null) {
    return null
  }
  return {
    familyId: family.fjolskyldunumer,
    individuals: (family.einstaklingar ?? []).map(
      (individual) => formatIndividualDto(individual) as IndividualDto,
    ),
  }
}
