import {
  EinstaklingurDTOAllt,
  EinstaklingurDTOTru,
  EinstaklingurDTOHju,
  EinstaklingurDTOHeimili,
  EinstaklingurDTOFaeding,
  EinstaklingurDTORikisfang,
  EinstaklingurDTOForsjaItem,
  EinstaklingurDTOLoghTengsl,
  EinstaklingurDTOItarAuka,
  EinstaklingurDTOLogForeldriItem,
} from '@island.is/clients/national-registry-v3'
import { mapGender, mapMaritalStatus } from '../shared/mapper'
import {
  Address,
  Person,
  Religion,
  Spouse,
  PersonBase,
  Birthplace,
  Citizenship,
  Custodian,
} from '../shared/models'
import { PersonV3 } from '../shared/types'
import { ExcludesFalse } from '../shared/utils'
import { Housing } from '../shared/models/housing.model'

export function formatPersonDiscriminated(
  individual: EinstaklingurDTOAllt | null | undefined,
): PersonV3 | null {
  const person = formatPerson(individual)
  if (!person) {
    return null
  }

  return {
    ...person,
    api: 'v3',
    rawData: individual ?? null,
  }
}

export function formatPerson(
  individual: EinstaklingurDTOAllt | null | undefined,
): Person | null {
  if (individual == null || !individual.kennitala || !individual.nafn) {
    return null
  }
  return {
    nationalId: individual.kennitala,
    name: individual.nafn,
    firstName: individual.fulltNafn?.eiginNafn ?? null,
    middleName: individual.fulltNafn?.milliNafn ?? null,
    lastName: individual.fulltNafn?.kenniNafn ?? null,
    nationalIdType: individual.tegundKennitolu ?? null,
    exceptionFromDirectMarketing: individual.bannmerking === 'true' ?? false,
    gender: mapGender(individual.kyn?.kynKodi ?? ''),
    legalResidence: individual.heimilisfang?.husHeiti ?? null,
    religion: individual.trufelag?.trufelagHeiti ?? null,
    fate: individual.afdrif ?? null,
  }
}

export function formatReligion(
  religion: EinstaklingurDTOTru | null | undefined,
): Religion | null {
  if (!religion) {
    return null
  }

  return {
    name: religion.trufelagHeiti ?? null,
    code: religion.trufelagKodi ?? null,
  }
}

export function formatHousing(
  residence: EinstaklingurDTOItarAuka | null | undefined,
  domicile: EinstaklingurDTOLoghTengsl | null | undefined,
): Housing | null {
  if (!residence || !domicile || !domicile.logheimilistengsl) {
    return null
  }

  return {
    domicileId: domicile.logheimilistengsl,
    domicileIdLast1stOfDecember: residence.logheimiliskodi112 ?? null,
    domicileIdPreviousIcelandResidence: residence.logheimiliskodiSIsl ?? null,
    domicileInhabitants: domicile.logheimilismedlimir
      ?.map((f) => {
        if (!f.kennitala || !f.nafn) {
          return null
        }
        return {
          nationalId: f.kennitala,
          name: f.nafn,
        }
      })
      .filter((Boolean as unknown) as ExcludesFalse),
    residence: residence.adsetur ? formatAddress(residence.adsetur) : null,
    address: residence.heimilisfang
      ? formatAddress(residence.heimilisfang)
      : null,
  }
}

export function formatSpouse(
  spouse: EinstaklingurDTOHju | null | undefined,
): Spouse | null {
  if (!spouse || !spouse.makiKennitala || !spouse.makiNafn) {
    return null
  }

  return {
    nationalId: spouse.makiKennitala,
    name: spouse.makiNafn,
    maritalStatus: mapMaritalStatus(spouse.hjuskaparstadaKodi ?? ''),
    cohabitationWithSpouse: spouse.sambudTexti ?? null,
  }
}

export function formatAddress(
  address: EinstaklingurDTOHeimili | null | undefined,
): Address | null {
  if (!address || !address.husHeiti || !address.poststod) {
    return null
  }

  return {
    streetAddress: address.husHeiti,
    postalCode: address.postnumer ?? null,
    apartment: address.ibud ?? null,
    city: address.poststod,
    municipalityText: address.sveitarfelag ?? null,
  }
}

export function formatBirthParent(
  individual: EinstaklingurDTOLogForeldriItem | null | undefined,
): PersonBase | null {
  if (
    !individual ||
    !individual.logForeldriKennitala ||
    !individual.logForeldriNafn
  ) {
    return null
  }

  return {
    nationalId: individual.logForeldriKennitala,
    name: individual.logForeldriNafn,
  }
}

export function formatBirthplace(
  birthplace: EinstaklingurDTOFaeding | null | undefined,
): Birthplace | null {
  if (!birthplace || !birthplace.faedingarStadurHeiti) {
    return null
  }

  return {
    location: birthplace.faedingarStadurHeiti,
    municipalityCode: birthplace.faedingarStadurKodi ?? null,
    dateOfBirth: birthplace.faedingarDagur
      ? new Date(birthplace.faedingarDagur)
      : null,
  }
}

export function formatCitizenship(
  citizenship: EinstaklingurDTORikisfang | null | undefined,
): Citizenship | null {
  if (!citizenship || !citizenship.rikisfangLand) {
    return null
  }

  return {
    name: citizenship.rikisfangLand,
    code: citizenship.rikisfangKodi ?? '',
  }
}

export function formatCustodian(
  custodian: EinstaklingurDTOForsjaItem | null | undefined,
  childDomicileData: EinstaklingurDTOLoghTengsl | null | undefined,
): Custodian | null {
  if (
    !custodian ||
    !custodian.forsjaAdiliKennitala ||
    !custodian.forsjaAdiliNafn
  ) {
    return null
  }

  return {
    nationalId: custodian.forsjaAdiliKennitala,
    name: custodian.forsjaAdiliNafn,
    code: custodian.forsjaKodi ?? null,
    text: custodian.forsjaTexti ?? null,
    livesWithChild:
      childDomicileData?.logheimilismedlimir
        ?.map((l) => l.kennitala)
        .includes(custodian.forsjaAdiliKennitala) ?? null,
  }
}
