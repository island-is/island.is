import { HjuDTO, SamDTO, EinstaklingurDTO } from '../../../gen/fetch'
import { formatIndividualDto, IndividualDto } from './individual.dto'

export interface CohabitationDto {
  cohabitationCode: string
  cohabitationCodeDescription: string
  spouseName: string
  spouseNationalId: string
  lastModified: Date | null
}

export interface CohabitantsDetailedDto {
  cohabitants: (IndividualDto | null)[]
}

export const formatCohabitantsDetailedDto = (
  cohabitants: EinstaklingurDTO[] | null | undefined,
): CohabitantsDetailedDto | null => {
  if (cohabitants == null) {
    return null
  }

  return {
    cohabitants: cohabitants.map(formatIndividualDto),
  }
}

export const formatCohabitationDtoV3FromHju = (
  cohabitation: HjuDTO | null,
): CohabitationDto | null => {
  if (cohabitation == null) {
    return null
  }

  const {
    kennitalaMaka: spouseNationalId,
    nafnMaka: spouseName,
    hjuskaparKodi: cohabitationCode,
    hjuskaparTexti: cohabitationCodeDescription,
    dagsetningBreytt: lastModified,
  } = cohabitation

  return {
    cohabitationCode: cohabitationCode || '',
    cohabitationCodeDescription: cohabitationCodeDescription || '',
    spouseName: spouseName || '',
    spouseNationalId: spouseNationalId || '',
    lastModified: lastModified ? new Date(lastModified) : null,
  }
}

export const formatCohabitationDtoV3FromSam = (
  cohabitation: SamDTO | undefined,
  hjuskapur: HjuDTO | undefined,
): CohabitationDto | null => {
  if (cohabitation == null) {
    return null
  }

  const { nafnMaka: spouseName, kennitalaMaka: spouseNationalId } = cohabitation

  return {
    cohabitationCode: hjuskapur?.hjuskaparKodi || '',
    cohabitationCodeDescription: cohabitation?.sambudTexti || '',
    spouseName: spouseName || '',
    spouseNationalId: spouseNationalId || '',
    lastModified: cohabitation?.dagsetningBreytt
      ? new Date(cohabitation.dagsetningBreytt)
      : null,
  }
}

export interface CohabitationCodeDto {
  code: string
  description?: string | null
}

export const formatCohabitationCodeDtoV3 = (
  cohabitation: HjuDTO | null,
): CohabitationCodeDto | null => {
  if (cohabitation == null) {
    return null
  }

  const { hjuskaparKodi: code, hjuskaparTexti: description } = cohabitation

  return {
    code: code || '',
    description: description || '',
  }
}
