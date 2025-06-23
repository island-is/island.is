import { LogheimilistengslItarDTO } from '../../../gen/fetch'
import { formatIndividualDto, IndividualDto } from './individual.dto'

export interface FamilyDto {
  familyId: string
  individuals: IndividualDto[]
}

export const formatFamilyDto = (
  logheimilisTengslItar: LogheimilistengslItarDTO | null,
): FamilyDto | null => {
  if (
    logheimilisTengslItar?.logheimiliseinstaklingar == null ||
    logheimilisTengslItar == null ||
    logheimilisTengslItar.logheimilisTengsl == null
  ) {
    return null
  }
  return {
    familyId: logheimilisTengslItar.logheimilisTengsl,
    individuals: logheimilisTengslItar.logheimiliseinstaklingar
      .map((individual) => formatIndividualDto(individual))
      .filter((x): x is IndividualDto => x !== null),
  }
}
