import { EinstaklingurDTOAllt } from '../../../gen/fetch'

export interface IndividualDto {
  nationalId: string
  name: string
  nationalIdType: string | null
  exceptionFromDirectMarketing: boolean
  fate: string | null
  rawData: string | null
}

export function formatIndividualDto(
  individual: EinstaklingurDTOAllt | null | undefined,
): IndividualDto | null {
  if (individual == null || !individual.kennitala || !individual.nafn) {
    return null
  }
  return {
    nationalId: individual.kennitala,
    name: individual.nafn,
    nationalIdType: individual.tegundKennitolu ?? null,
    exceptionFromDirectMarketing: individual.bannmerking === 'true' ?? false,
    fate: individual.afdrif ?? null,
    rawData: JSON.stringify(individual),
  }
}
