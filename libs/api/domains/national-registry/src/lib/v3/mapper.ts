import {
  EinstaklingurDTOAllt,
  EinstaklingurDTOHju,
  EinstaklingurDTOHeimili,
  EinstaklingurDTOFaeding,
  EinstaklingurDTORikisfang,
  EinstaklingurDTOForsjaItem,
  EinstaklingurDTOLoghTengsl,
  EinstaklingurDTOItarAuka,
  EinstaklingurDTOLogForeldriItem,
  EinstaklingurDTONafnAllt,
} from '@island.is/clients/national-registry-v3'
import { mapGender, mapMaritalStatus } from '../shared/mapper'
import {
  Address,
  Person,
  Spouse,
  PersonBase,
  Birthplace,
  Citizenship,
  Custodian,
} from '../shared/models'
import { ChildCustodyV3, PersonV3 } from '../shared/types'
import { Housing } from '../shared/models/housing.model'
import { Name } from '../shared/models/name.model'
import * as kennitala from 'kennitala'
import { encrypt, isDefined } from '@island.is/shared/utils'

export function formatPersonDiscriminated(
  individual?: EinstaklingurDTOAllt | null,
  nationalId?: string,
): PersonV3 | null {
  const person = formatPerson(individual, nationalId)
  if (!person) {
    return null
  }

  return {
    ...person,
    api: 'v3',
    rawData: individual ?? null,
  }
}

export function formatChildCustody(
  childCustody?: EinstaklingurDTOForsjaItem | null,
): ChildCustodyV3 | null {
  if (!childCustody?.barnKennitala || !childCustody?.barnNafn) {
    return null
  }

  return {
    nationalId: childCustody.barnKennitala,
    fullName: childCustody.barnNafn,
    api: 'v3',
  }
}

export function formatPerson(
  individual?: EinstaklingurDTOAllt | null,
  nationalId?: string,
): Person | null {
  if (individual === null || !individual?.kennitala || !individual?.nafn) {
    return null
  }

  let legalResidence = ''
  if (
    individual.heimilisfang?.husHeiti &&
    individual.heimilisfang.postnumer &&
    individual.heimilisfang.poststod
  ) {
    legalResidence = `${individual.heimilisfang?.husHeiti}, ${individual.heimilisfang.postnumer} ${individual.heimilisfang.poststod}`
  }

  return {
    nationalId: individual.kennitala,
    fullName: individual.nafn,
    nationalIdType: individual.tegundKennitolu ?? null,
    exceptionFromDirectMarketing: individual.bannmerking === true ?? false,
    gender: mapGender(individual.kyn?.kynKodi ?? ''),
    religion: individual.trufelag?.trufelagHeiti ?? null,
    maritalStatus: mapMaritalStatus(
      individual.hjuskaparstada?.hjuskaparstadaKodi ?? '',
    ),
    ...(nationalId &&
      individual.kennitala && {
        baseId: encrypt(individual.kennitala, nationalId),
      }),

    //DEPRECATION LINE -- below shall be removed
    legalResidence: legalResidence ?? null,
    banMarking: {
      banMarked: individual.bannmerking === true ?? false,
    },
    firstName: individual.fulltNafn?.eiginNafn ?? null,
    middleName: individual.fulltNafn?.milliNafn ?? null,
    lastName: individual.fulltNafn?.kenniNafn ?? null,
    birthPlace: individual.faedingarstadur?.faedingarStadurHeiti ?? null,
    familyNr: individual.logheimilistengsl?.logheimilistengsl,
    age: kennitala.info(individual.kennitala).age,
    birthday: kennitala.info(individual.kennitala).birthday,
    address: individual.heimilisfang
      ? formatAddress(individual.heimilisfang)
      : null,
  }
}

export function formatHousing(
  nationalId: string,
  housing?: EinstaklingurDTOItarAuka | null,
  domicileData?: EinstaklingurDTOLoghTengsl | null,
  address?: EinstaklingurDTOHeimili | null,
): Housing | null {
  const addressData = housing?.heimilisfang ?? address

  const domicileId = domicileData?.logheimilistengsl ?? housing?.logheimiliskodi

  if (!domicileId) {
    return null
  }

  return {
    domicileId,
    domicileIdLast1stOfDecember: housing?.logheimiliskodi112 ?? null,
    domicileIdPreviousIcelandResidence: housing?.logheimiliskodiSIsl ?? null,
    domicileInhabitants: domicileData?.logheimilismedlimir
      ?.filter((f) => f.kennitala !== nationalId)
      ?.map((f) => {
        if (!f.kennitala || !f.nafn) {
          return null
        }
        return {
          nationalId: f.kennitala,
          fullName: f.nafn,
        }
      })
      .filter(isDefined),
    residence: housing?.adsetur ? formatAddress(housing?.adsetur) : null,
    address: addressData ? formatAddress(addressData) : null,
  }
}

export function formatSpouse(
  spouse?: EinstaklingurDTOHju | null,
): Spouse | null {
  if (!spouse || !spouse.makiKennitala || !spouse.makiNafn) {
    return null
  }

  return {
    nationalId: spouse.makiKennitala,
    fullName: spouse.makiNafn,
    cohabitationWithSpouse: spouse.sambudTexti ?? false,
    maritalStatus: spouse.hjuskaparstadaTexti ?? null,
  }
}

export function formatAddress(
  address?: EinstaklingurDTOHeimili | null,
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
  individual?: EinstaklingurDTOLogForeldriItem | null,
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
    fullName: individual.logForeldriNafn,
  }
}

export function formatBirthplace(
  birthplace?: EinstaklingurDTOFaeding | null,
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
  citizenship?: EinstaklingurDTORikisfang | null,
): Citizenship | null {
  if (!citizenship || !citizenship.rikisfangLand) {
    return null
  }

  return {
    name: citizenship.rikisfangLand,
    code: citizenship.rikisfangKodi ?? '',
  }
}

export function formatName(
  name?: EinstaklingurDTONafnAllt | null,
): Name | null {
  if (!name) {
    return null
  }

  return {
    firstName: name.eiginNafn ?? '',
    middleName: name.milliNafn ?? '',
    lastName: name.kenniNafn ?? '',
    fullName: name.fulltNafn ?? '',
  }
}

export function formatCustodian(
  custodian?: EinstaklingurDTOForsjaItem | null,
  childDomicileData?: EinstaklingurDTOLoghTengsl | null,
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
    fullName: custodian.forsjaAdiliNafn,
    code: custodian.forsjaKodi ?? null,
    text: custodian.forsjaTexti ?? null,
    livesWithChild:
      childDomicileData?.logheimilismedlimir
        ?.map((l) => l.kennitala)
        .includes(custodian.forsjaAdiliKennitala) ?? null,
  }
}
