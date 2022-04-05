import { AddressDto, formatAddressDto } from './address.dto'
import { Einstaklingsupplysingar } from '../../../gen/fetch'

export interface IndividualDto {
  nationalId: string
  name: string
  givenName: string | null
  middleName: string | null
  familyName: string | null
  fullName: string | null
  genderCode: string
  exceptionFromDirectMarketing: boolean
  birthdate: Date
  legalDomicile: AddressDto | null
  residence: AddressDto | null
}

export function formatIndividualDto(
  individual: Einstaklingsupplysingar | null | undefined,
): IndividualDto | null {
  if (individual == null) {
    return individual ?? null
  }
  return {
    nationalId: individual.kennitala,
    name: individual.nafn,
    givenName: individual.eiginnafn ?? null,
    middleName: individual.millinafn ?? null,
    familyName: individual.kenninafn ?? null,
    fullName: individual.fulltNafn ?? null,
    genderCode: individual.kynkodi,
    exceptionFromDirectMarketing: individual.bannmerking,
    birthdate: individual.faedingardagur,
    legalDomicile: formatAddressDto(individual.logheimili),
    residence: formatAddressDto(individual.adsetur),
  }
}
