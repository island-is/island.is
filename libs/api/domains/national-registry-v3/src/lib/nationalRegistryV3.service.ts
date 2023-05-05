import {
  EinstaklingurDTOAllt,
  NationalRegistryV3ClientService,
} from '@island.is/clients/national-registry-v3'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryV3Person } from './graphql/models/nationalRegistryPerson.model'
import { User } from '@island.is/auth-nest-tools'
import { ChildGuardianship } from './graphql/models/nationalRegistryChildGuardianship.model'
import { NationalRegistryV3Spouse } from './graphql/models/nationalRegistrySpouse.model'
import { Inject } from '@nestjs/common'
import { NationalRegistryV3Address } from './graphql/models/nationalRegistryAddress.model'
import { NationalRegistryV3Birthplace } from './graphql/models/nationalRegistryBirthplace.model'
import { NationalRegistryV3Citizenship } from './graphql/models/nationalRegistryCitizenship.model'
import { NationalRegistryV3Name } from './graphql/models/nationalRegistryName.model'
import { NationalRegistryV3Religion } from './graphql/models/nationalRegistryReligion.model'

type ExcludesFalse = <T>(x: T | null | undefined | '') => x is T

export class NationalRegistryV3Service {
  constructor(
    private nationalRegistryApi: NationalRegistryV3ClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private fetchData = (nationalId: string) =>
    this.nationalRegistryApi.getData(nationalId)

  private extractPerson = (data: EinstaklingurDTOAllt) => {
    if (!data.kennitala || !data.nafn) {
      return null
    }

    return (
      data && {
        nationalId: data.kennitala,
        fullName: data.nafn,
        gender: data.kyn?.kynTexti,
        familyRegistrationCode: data.itarupplysingar?.logheimilistengsl,
        banMarking: data.bannmerking === 'true',
      }
    )
  }

  async getNationalRegistryPerson(
    nationalId: string,
  ): Promise<NationalRegistryV3Person | null> {
    const person = await this.fetchData(nationalId)

    return this.extractPerson(person)
  }

  async getAddress(
    nationalId: string,
  ): Promise<NationalRegistryV3Address | null> {
    const data = await this.fetchData(nationalId)

    return (
      (data.heimilisfang && {
        streetName: data.heimilisfang.husHeiti,
        postalCode: data.heimilisfang.postnumer,
        city: data.heimilisfang.poststod,
        municipalityText: data.heimilisfang.sveitarfelag,
      }) ??
      null
    )
  }

  async getChildGuardianship(
    user: User,
    childNationalId: string,
  ): Promise<ChildGuardianship | null> {
    const data = await this.fetchData(user.nationalId)

    if (!data.forsja?.born) {
      return null
    }

    const childrenNationalIds = data.forsja.born.map((b) => b.barnKennitala)

    const isChildOfUser = childrenNationalIds.some(
      (childId) => childId === childNationalId,
    )

    if (!isChildOfUser) {
      return null
    }

    const childData = await this.fetchData(childNationalId)

    const legalDomicileParent = childData.logforeldrar
      ? childData.logforeldrar?.logForeldrar
          ?.map((l) => l.logForeldriKennitala)
          .filter((Boolean as unknown) as ExcludesFalse)
      : []

    return {
      childNationalId,
      legalDomicileParent,
    }
  }

  async getSpouse(
    nationalId: string,
  ): Promise<NationalRegistryV3Spouse | null> {
    const data = await this.fetchData(nationalId)

    return (
      (data.hjuskaparstada && {
        nationalId: data.hjuskaparstada.makiKennitala,
        fullName: data.hjuskaparstada.makiNafn,
        maritalStatus: data.hjuskaparstada.hjuskaparstadaTexti,
        cohabitation: data.hjuskaparstada.sambudTexti,
      }) ??
      null
    )
  }

  async getCitizenship(
    nationalId: string,
  ): Promise<NationalRegistryV3Citizenship | null> {
    const data = await this.fetchData(nationalId)

    return (
      (data.rikisfang && {
        name: data.rikisfang.rikisfangLand,
        code: data.rikisfang.rikisfangKodi,
      }) ??
      null
    )
  }

  async getChildrenCustodyInformation(
    nationalId: string,
  ): Promise<Array<NationalRegistryV3Person> | null> {
    const parentData = await this.fetchData(nationalId)

    const children = parentData.forsja?.born?.length
      ? parentData.forsja.born
      : []

    const childDetails: Array<NationalRegistryV3Person | null> = await Promise.all(
      children.map(async (child) => {
        if (!child.barnKennitala || !child.barnNafn) {
          return null
        }

        const childDetails = await this.fetchData(child.barnKennitala)

        const otherParents =
          childDetails.forsja?.forsjaradilar?.filter(
            (f) => f.forsjaAdiliKennitala !== nationalId,
          ) ?? []

        const otherParentsDetails = await Promise.all(
          otherParents.map(async (p) => {
            if (!p.forsjaAdiliKennitala) {
              return null
            }
            return await this.fetchData(p.forsjaAdiliKennitala)
          }),
        )

        const livesWithApplicant =
          childDetails.itarupplysingar?.logheimilistengsl ==
          parentData.itarupplysingar?.logheimilistengsl

        return {
          ...this.extractPerson(childDetails),
          nationalId: child.barnKennitala,
          fullName: child.barnNafn,
          livesWithApplicant,
          livesWithBothParents:
            livesWithApplicant &&
            otherParentsDetails.every(
              (o) =>
                o?.itarupplysingar?.logheimilistengsl ===
                childDetails.itarupplysingar?.logheimilistengsl,
            ),
          otherParent:
            otherParentsDetails.length && otherParentsDetails[0]
              ? this.extractPerson(otherParentsDetails[0])
              : null,
        }
      }),
    )

    return childDetails.filter(
      (child): child is NationalRegistryV3Person => child != null,
    )
  }

  async getBirthplace(
    nationalId: string,
  ): Promise<NationalRegistryV3Birthplace | null> {
    const data = await this.fetchData(nationalId)

    return (
      (data.faedingarstadur && {
        location: data.faedingarstadur.faedingarStadurHeiti,
        municipalityCode: data.faedingarstadur.faedingarStadurKodi,
        dateOfBirth: data.faedingarstadur.faedingarDagur
          ? new Date(data.faedingarstadur.faedingarDagur)
          : undefined,
      }) ??
      null
    )
  }

  async getName(nationalId: string): Promise<NationalRegistryV3Name | null> {
    const data = await this.fetchData(nationalId)

    return (
      (data.fulltNafn && {
        givenName: data.fulltNafn.eiginNafn,
        middleName: data.fulltNafn.milliNafn,
        lastName: data.fulltNafn.kenniNafn,
      }) ??
      null
    )
  }

  async getReligion(
    nationalId: string,
  ): Promise<NationalRegistryV3Religion | null> {
    const data = await this.fetchData(nationalId)

    return (
      (data.trufelag && {
        name: data.trufelag.trufelagHeiti,
      }) ??
      null
    )
  }
}
