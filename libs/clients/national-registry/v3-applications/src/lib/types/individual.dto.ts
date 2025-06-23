import { AddressDto, formatAddressDto } from './address.dto'
import { EinstaklingurDTO } from '../../../gen/fetch'

export interface IndividualDto {
  nationalId: string
  name: string
  givenName: string | null
  middleName: string | null
  familyName: string | null
  fullName: string | null
  genderCode: string
  genderDescription: string
  exceptionFromDirectMarketing: boolean
  birthdate: Date
  legalDomicile: AddressDto | null
  residence: AddressDto | null
}

export const formatIndividualDto = (
  individual: EinstaklingurDTO | null | undefined,
): IndividualDto | null => {
  if (individual == null) {
    return null
  }
  let givenName: string | null = null
  let middleName: string | null = null
  let familyName: string | null = null
  if (individual.nafn) {
    const nameParts = individual.nafn.split(' ')
    if (nameParts.length > 2) {
      middleName = nameParts.slice(1, -1).join(' ')
    }
    givenName = nameParts[0]
    familyName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : null
  }
  return {
    nationalId: individual.kennitala ?? '',
    name: individual.nafn ?? '',
    givenName,
    middleName,
    familyName,
    fullName: individual.nafn ?? null,
    genderCode: individual.kynKodi ?? '',
    genderDescription: individual.kynTexti ?? '',
    exceptionFromDirectMarketing: individual.bannmerking ?? false,
    birthdate: individual.faedingardagur ?? new Date(),
    legalDomicile: formatAddressDto(individual.logheimili),
    residence: formatAddressDto(individual.adsetur),
  }
}
