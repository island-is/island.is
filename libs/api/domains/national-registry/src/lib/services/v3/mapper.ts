import {
  EinstaklingurDTOAllt,
  EinstaklingurDTOTru,
  EinstaklingurDTOHju,
  EinstaklingurDTOHeimili,
  EinstaklingurDTOFaeding,
  EinstaklingurDTORikisfang,
  EinstaklingurDTOForsjaItem,
  EinstaklingurDTOLoghTengsl,
  EinstaklingurDTONafnAllt,
  EinstaklingurDTOItarAuka,
  EinstaklingurDTOBase,
  EinstaklingurDTOLogForeldriItem,
} from '@island.is/clients/national-registry-v3'
import { NationalRegistryAddress } from '../../models/nationalRegistryAddress.model'
import { NationalRegistryBirthplace } from '../../models/nationalRegistryBirthplace.model'
import { NationalRegistryCitizenship } from '../../models/nationalRegistryCitizenship.model'
import { NationalRegistryCustodian } from '../../models/nationalRegistryCustodian.model'
import { NationalRegistryName } from '../../models/nationalRegistryName.model'
import {
  NationalRegistryPersonV3,
  PersonV3,
} from '../../models/nationalRegistryPerson.model'
import { NationalRegistryReligion } from '../../models/nationalRegistryReligion.model'
import { NationalRegistrySpouse } from '../../models/nationalRegistrySpouse.model'
import { NationalRegistryLivingArrangements } from '../../models/nationalRegistryLivingArrangements.model'
import { ExcludesFalse, mapGender, mapMaritalStatus } from '../../utils'
import { NationalRegistryBasePerson } from '../../models/nationalRegistryBasePerson.model'

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
): NationalRegistryPersonV3 | null {
  if (individual == null || !individual.kennitala || !individual.nafn) {
    return null
  }
  return {
    nationalId: individual.kennitala,
    fullName: individual.fulltNafn?.fulltNafn ?? null,
    nationalIdType: individual.tegundKennitolu ?? null,
    exceptionFromDirectMarketing: individual.bannmerking === 'true' ?? false,
    gender: mapGender(individual.kyn?.kynKodi ?? ''),
    genderText: individual.kyn?.kynTexti ?? '',
    genderCode: individual.kyn?.kynKodi,
    fate: individual.afdrif ?? null,
  }
}

export function formatReligion(
  religion: EinstaklingurDTOTru | null | undefined,
): NationalRegistryReligion | null {
  if (!religion) {
    return null
  }

  return {
    name: religion.trufelagHeiti ?? null,
    code: religion.trufelagKodi ?? null,
  }
}

export function formatLivingArrangements(
  residence: EinstaklingurDTOItarAuka | null | undefined,
  domicile: EinstaklingurDTOLoghTengsl | null | undefined,
): NationalRegistryLivingArrangements | null {
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
          fullName: f.nafn,
        }
      })
      .filter((Boolean as unknown) as ExcludesFalse),
    address: residence.adsetur ? formatAddress(residence.adsetur) : null,
  }
}

export function formatSpouse(
  spouse: EinstaklingurDTOHju | null | undefined,
): NationalRegistrySpouse | null {
  if (!spouse || !spouse.makiKennitala || !spouse.makiNafn) {
    return null
  }

  return {
    nationalId: spouse.makiKennitala,
    fullName: spouse.makiNafn,
    maritalStatus: mapMaritalStatus(spouse.hjuskaparstadaKodi ?? ''),
    cohabitation: spouse.sambudTexti ?? null,
  }
}

export function formatAddress(
  address: EinstaklingurDTOHeimili | null | undefined,
): NationalRegistryAddress | null {
  if (!address || !address.husHeiti) {
    return null
  }

  return {
    streetName: address.husHeiti,
    postalCode: address.postnumer ?? null,
    city: address.poststod ?? null,
    municipalityText: address.sveitarfelag ?? null,
  }
}

export function formatBirthParent(
  individual: EinstaklingurDTOLogForeldriItem | null | undefined,
): NationalRegistryBasePerson | null {
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
  birthplace: EinstaklingurDTOFaeding | null | undefined,
): NationalRegistryBirthplace | null {
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
): NationalRegistryCitizenship | null {
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
): NationalRegistryCustodian | null {
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
/*
export function formatDomicilePopulace(
  domicileRelations: EinstaklingurDTOLoghTengsl | null | undefined,
): NationalRegistryDomicileInhabitants | null {
  if (!domicileRelations?.logheimilistengsl) {
    return null
  }

  return {
    legalDomicileId: domicileRelations.logheimilistengsl,
    populace: domicileRelations.logheimilismedlimir
      ?.map((l) => {
        if (!l.kennitala) {
          return null
        }
        return {
          nationalId: l.kennitala,
          fullName: l.nafn,
        }
      })
      .filter((Boolean as unknown) as ExcludesFalse),
  }
}*/
export function formatName(
  name: EinstaklingurDTONafnAllt | null | undefined,
): NationalRegistryName | null {
  if (!name) {
    return null
  }

  return {
    givenName: name.eiginNafn ?? null,
    middleName: name.milliNafn ?? null,
    lastName: name.kenniNafn ?? null,
  }
}
