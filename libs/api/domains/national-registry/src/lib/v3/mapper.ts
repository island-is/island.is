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
import {
  mapGender,
  mapMaritalStatus,
  mapNationalIdType,
} from '../shared/mapper'
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
import { maskString, isDefined } from '@island.is/shared/utils'
import { FamilyChild, User } from './types'

export const formatPersonDiscriminated = async (
  individual?: EinstaklingurDTOAllt | null,
  nationalId?: string,
  useFakeData?: boolean,
): Promise<PersonV3 | null> => {
  const person = await formatPerson(individual, nationalId)
  if (!person) {
    return null
  }

  return {
    ...person,
    api: 'v3',
    rawData: individual ?? null,
    useFakeData,
  }
}

export const formatChildCustody = (
  childCustody?: EinstaklingurDTOForsjaItem | null,
  useFakeData?: boolean,
): ChildCustodyV3 | null => {
  if (!childCustody?.barnKennitala || !childCustody?.barnNafn) {
    return null
  }
  return {
    nationalId: childCustody.barnKennitala,
    fullName: childCustody.barnNafn,
    useFakeData: useFakeData,
    api: 'v3',
  }
}

export const formatPerson = async (
  individual?: EinstaklingurDTOAllt | null,
  nationalId?: string,
): Promise<Person | null> => {
  if (individual === null || !individual?.kennitala || !individual?.nafn) {
    return null
  }

  const maskedNationalId = nationalId
    ? await maskString(individual.kennitala, nationalId)
    : null

  return {
    nationalId: individual.kennitala,
    fullName: individual.nafn,
    nationalIdType: mapNationalIdType(individual.tegundEinstaklingsNr ?? -1),
    exceptionFromDirectMarketing: individual.bannmerking === true,
    gender: mapGender(individual.kyn?.kynKodi ?? ''),
    religion: individual.trufelag?.trufelagHeiti ?? null,
    maritalStatus: mapMaritalStatus(
      individual.hjuskaparstada?.hjuskaparstadaKodi ?? '',
    ),
    ...(nationalId &&
      individual.kennitala && {
        baseId: maskedNationalId,
      }),
    name: {
      firstName: individual.fulltNafn?.eiginNafn ?? null,
      middleName: individual.fulltNafn?.milliNafn ?? null,
      lastName: individual.fulltNafn?.kenniNafn ?? null,
      fullName: individual.fulltNafn?.fulltNafn ?? individual.nafn,
      displayName: individual.nafn,
    },

    //DEPRECATION LINE -- below shall be removed
    legalResidence: formatLegalResidence(individual.heimilisfang),
    banMarking: {
      banMarked: individual.bannmerking === true,
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

export const formatHousing = (
  nationalId: string,
  housing?: EinstaklingurDTOItarAuka | null,
  domicileData?: EinstaklingurDTOLoghTengsl | null,
  address?: EinstaklingurDTOHeimili | null,
): Housing | null => {
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

export const formatSpouse = (
  spouse?: EinstaklingurDTOHju | null,
): Spouse | null => {
  if (!spouse || !spouse.makiKennitala || !spouse.makiNafn) {
    return null
  }

  return {
    nationalId: spouse.makiKennitala,
    name: spouse.makiNafn,
    fullName: spouse.makiNafn,
    cohabitationWithSpouse: spouse.sambudTexti ?? false,
    maritalStatus: spouse.hjuskaparstadaTexti ?? null,
  }
}

export const formatAddress = (
  address?: EinstaklingurDTOHeimili | null,
): Address | null => {
  if (!address || !address.husHeiti) {
    return null
  }

  return {
    streetAddress: address.husHeiti,
    postalCode: address.postnumer ?? null,
    apartment: address.ibud ?? null,
    city: address.poststod ?? null,
    municipalityText: address.sveitarfelag ?? null,
  }
}

export const formatBirthParent = (
  individual?: EinstaklingurDTOLogForeldriItem | null,
): PersonBase | null => {
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

export const formatBirthplace = (
  birthplace?: EinstaklingurDTOFaeding | null,
): Birthplace | null => {
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

export const formatCitizenship = (
  citizenship?: EinstaklingurDTORikisfang | null,
): Citizenship | null => {
  if (!citizenship || !citizenship.rikisfangLand) {
    return null
  }

  return {
    name: citizenship.rikisfangLand,
    code: citizenship.rikisfangKodi ?? '',
  }
}

export const formatName = (
  name?: EinstaklingurDTONafnAllt | null,
): Name | null => {
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

export const formatCustodian = (
  custodian?: EinstaklingurDTOForsjaItem | null,
  childDomicileData?: EinstaklingurDTOLoghTengsl | null,
): Custodian | null => {
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

// Backwards compatibility with deprecated schema
export const formatUser = (
  individual?: EinstaklingurDTOAllt | null,
): User | null => {
  if (!individual || !individual.kennitala || !individual.nafn) {
    return null
  }

  return {
    nationalId: individual.kennitala,
    name: individual.nafn,
    firstName: individual.fulltNafn?.eiginNafn ?? null,
    middleName: individual.fulltNafn?.milliNafn ?? null,
    lastName: individual.fulltNafn?.kenniNafn ?? null,
    fullName: individual.fulltNafn?.fulltNafn ?? individual.nafn,
    gender: mapGender(individual.kyn?.kynKodi ?? ''),
    maritalStatus: mapMaritalStatus(
      individual.hjuskaparstada?.hjuskaparstadaKodi ?? '',
    ),
    religion: individual.trufelag?.trufelagHeiti ?? null,
    familyNr: individual.logheimilistengsl?.logheimilistengsl,
    banMarking: {
      banMarked: individual.bannmerking === true,
    },
    citizenship: {
      code: individual.rikisfang?.rikisfangKodi ?? '',
      name: individual.rikisfang?.rikisfangLand ?? '',
    },
    address: formatAddress(individual.heimilisfang),
    birthPlace: {
      // This is the only field exposed in the user model.
      city: individual.faedingarstadur?.faedingarStadurHeiti ?? null,
    },
    spouse: formatSpouse(individual.hjuskaparstada),
  }
}

const formatLegalResidence = (address?: EinstaklingurDTOHeimili) => {
  if (
    !address ||
    !address.husHeiti ||
    !address.postnumer ||
    !address.poststod
  ) {
    return null
  }
  return `${address.husHeiti}, ${address.postnumer} ${address.poststod}`
}

const formatPostal = (address?: EinstaklingurDTOHeimili) => {
  if (!address || !address.postnumer || !address.poststod) {
    return null
  }
  return `${address.postnumer} ${address.poststod}`
}

export const formatFamilyChild = (
  child: EinstaklingurDTOAllt | null,
): FamilyChild | null => {
  if (!child || !child.kennitala || !child.nafn) {
    return null
  }
  const birthday = child.faedingarstadur?.faedingarDagur
  const parent1 = child.logforeldrar?.logForeldrar?.[0]
  const parent2 = child.logforeldrar?.logForeldrar?.[1]
  const custody1 = child.forsja?.forsjaradilar?.[0]
  const custody2 = child.forsja?.forsjaradilar?.[1]

  return {
    nationalId: child.kennitala,
    fullName: child.fulltNafn?.fulltNafn ?? child.nafn,
    displayName: child.nafn ?? undefined,
    firstName: child.fulltNafn?.eiginNafn ?? undefined,
    middleName: child.fulltNafn?.milliNafn ?? undefined,
    surname: child.fulltNafn?.kenniNafn ?? undefined,
    lastName: child.fulltNafn?.kenniNafn ?? undefined,
    gender: child.kyn?.kynKodi ?? undefined,
    genderDisplay: child.kyn?.kynTexti ?? undefined,
    birthday: birthday ? new Date(birthday).toISOString() : undefined,
    parent1: parent1?.logForeldriKennitala ?? undefined,
    nameParent1: parent1?.logForeldriNafn ?? undefined,
    parent2: parent2?.logForeldriKennitala ?? undefined,
    nameParent2: parent2?.logForeldriNafn ?? undefined,
    custody1: custody1?.forsjaAdiliKennitala ?? undefined,
    nameCustody1: custody1?.forsjaAdiliNafn ?? undefined,
    custodyText1: custody1?.forsjaTexti ?? undefined,
    custody2: custody2?.forsjaAdiliKennitala ?? undefined,
    nameCustody2: custody2?.forsjaAdiliNafn ?? undefined,
    custodyText2: custody2?.forsjaTexti ?? undefined,
    birthplace: child.faedingarstadur?.faedingarStadurHeiti ?? undefined,
    religion: child.trufelag?.trufelagHeiti ?? undefined,
    nationality: child.rikisfang?.rikisfangLand ?? undefined,
    homeAddress: child.heimilisfang?.husHeiti ?? undefined,
    municipality: child.heimilisfang?.sveitarfelag ?? undefined,
    postal: formatPostal(child.heimilisfang) || undefined,
  }
}
