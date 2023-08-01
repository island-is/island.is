import {
  EinstaklingurDTOAllt,
  EinstaklingurDTOItarAuka,
  EinstaklingurDTOLoghTengsl,
  NationalRegistryV3ClientService,
} from '@island.is/clients/national-registry-v3'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject } from '@nestjs/common'
import { Birthplace } from '../shared/models/birthplace.model'
import { Custodian } from '../shared/models/custodian.model'
import { LivingArrangement } from '../shared/models/housing.model'
import { PersonBase } from '../shared/models/personBase.model'
import { Religion } from '../shared/models/religion.model'
import { Spouse } from '../shared/models/spouse.model'
import {
  formatPersonDiscriminated,
  formatAddress,
  formatSpouse,
  formatCitizenship,
  formatCustodian,
  formatBirthParent,
  formatBirthplace,
  formatReligion,
  formatLivingArrangements,
} from './mapper'

import { ExcludesFalse } from '../shared/utils'
import { User } from '@island.is/auth-nest-tools'
import { Address } from '../shared/models/address.model'
import { Citizenship } from '../shared/models/citizenship.model'
import { ChildCustody } from '../shared/models/childCustody.model'
import { PersonV3 } from '../shared/types'
import { Person } from '../shared/models'

export class BrokerService {
  constructor(
    private nationalRegistryV3: NationalRegistryV3ClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getPerson(
    nationalId: string,
    rawData?: EinstaklingurDTOAllt | null,
  ): Promise<PersonV3 | null> {
    const user =
      rawData ??
      (await this.nationalRegistryV3.getAllDataIndividual(nationalId))

    if (!user?.kennitala) {
      return null
    }

    return formatPersonDiscriminated(user)
  }

  async getAddress(
    nationalId: string,
    rawData?: EinstaklingurDTOAllt | null,
  ): Promise<Address | null> {
    const address = rawData?.heimilisfang
      ? rawData.heimilisfang
      : await this.nationalRegistryV3.getAddress(nationalId)

    return address && formatAddress(address)
  }

  async getParents(
    nationalId: string,
    rawData?: EinstaklingurDTOAllt | null,
  ): Promise<Array<PersonBase> | null> {
    const data =
      rawData?.logforeldrar ??
      (await this.nationalRegistryV3.getAllDataIndividual(nationalId))
        ?.logforeldrar

    if (!data?.logForeldrar) {
      return null
    }

    return data.logForeldrar
      .map((l) => {
        if (!l.logForeldriKennitala || !l.logForeldriNafn) {
          return null
        }
        return {
          nationalId: l.logForeldriKennitala,
          fullName: l.logForeldriNafn,
        }
      })
      .filter((Boolean as unknown) as ExcludesFalse)
  }

  async getCustodians(
    nationalId: string,
    rawData?: EinstaklingurDTOAllt | null,
  ): Promise<Array<Custodian> | null> {
    const data =
      rawData ??
      (await this.nationalRegistryV3.getAllDataIndividual(nationalId))

    if (!data?.forsja || !data.logheimilistengsl) {
      return null
    }

    const custodians = data.forsja?.forsjaradilar
      ?.map((custodian) => {
        if (!custodian.forsjaAdiliNafn || !custodian.forsjaAdiliKennitala) {
          return null
        }
        return {
          fullName: custodian.forsjaAdiliNafn,
          nationalId: custodian.forsjaAdiliKennitala,
          code: custodian.forsjaKodi ?? null,
          text: custodian.forsjaTexti ?? null,
          livesWithChild:
            data.logheimilistengsl?.logheimilismedlimir?.some(
              (l) => l.kennitala === custodian.forsjaAdiliKennitala,
            ) ?? null,
        } as Custodian
      })
      .filter((Boolean as unknown) as ExcludesFalse)

    return custodians ?? null
  }

  async getSpouse(
    nationalId: string,
    rawData?: EinstaklingurDTOAllt | null,
  ): Promise<Spouse | null> {
    const data =
      rawData?.hjuskaparstada ??
      (await this.nationalRegistryV3.getSpouse(nationalId))

    return data && formatSpouse(data)
  }

  async getCitizenship(
    nationalId: string,
    rawData?: EinstaklingurDTOAllt | null,
  ): Promise<Citizenship | null> {
    const data =
      rawData?.rikisfang ??
      (await this.nationalRegistryV3.getCitizenship(nationalId))

    return data && formatCitizenship(data)
  }

  async getChildrenCustodyInformation(
    parentNationalId: string,
    rawData?: EinstaklingurDTOAllt | null,
  ): Promise<Array<ChildCustody> | null> {
    const parentData =
      rawData ??
      (await this.nationalRegistryV3.getAllDataIndividual(parentNationalId))

    if (!parentData) {
      return null
    }

    const children = parentData.forsja?.born?.length
      ? parentData.forsja.born
      : []

    const childDetails: Array<ChildCustody | null> = await Promise.all(
      children.map(async (child) => {
        if (!child.barnKennitala || !child.barnNafn) {
          return null
        }

        const childDetails = await this.nationalRegistryV3.getAllDataIndividual(
          child.barnKennitala,
        )

        if (!childDetails) {
          return null
        }

        return {
          nationalId: child.barnKennitala,
          fullName: child.barnNafn,
          custodians: childDetails.forsja?.forsjaradilar
            ?.map((f) => formatCustodian(f, childDetails.logheimilistengsl))
            .filter((Boolean as unknown) as ExcludesFalse),
          birthParents: childDetails.logforeldrar?.logForeldrar
            ?.map((p) => formatBirthParent(p))
            .filter((Boolean as unknown) as ExcludesFalse),
        }
      }),
    )

    return childDetails.filter((child): child is ChildCustody => child != null)
  }

  async getBirthplace(
    nationalId: string,
    rawData?: EinstaklingurDTOAllt | null,
  ): Promise<Birthplace | null> {
    const data =
      rawData?.faedingarstadur ??
      (await this.nationalRegistryV3.getBirthplace(nationalId))
    return data && formatBirthplace(data)
  }

  async getReligion(
    nationalId: string,
    rawData?: EinstaklingurDTOAllt | null,
  ): Promise<Religion | null> {
    const data =
      rawData?.trufelag ??
      (await this.nationalRegistryV3.getReligion(nationalId))

    return data && formatReligion(data)
  }

  async getLivingArrangement(
    nationalId: string,
    rawData?: EinstaklingurDTOAllt | null,
  ): Promise<LivingArrangement | null> {
    const data: [
      EinstaklingurDTOItarAuka | null,
      EinstaklingurDTOLoghTengsl | null,
    ] = rawData
      ? [rawData?.itarupplysingar ?? null, rawData?.logheimilistengsl ?? null]
      : await Promise.all([
          this.nationalRegistryV3.getResidence(nationalId),
          this.nationalRegistryV3.getDomicile(nationalId),
        ])

    return data && formatLivingArrangements(...data)
  }
}
