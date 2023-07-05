import {
  EinstaklingurDTOAllt,
  NationalRegistryV3ClientService,
} from '@island.is/clients/national-registry-v3'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Person } from './graphql/models/nationalRegistryPerson.model'
import { User } from '@island.is/auth-nest-tools'
import { ChildGuardianship } from './graphql/models/nationalRegistryChildGuardianship.model'
import { Spouse } from './graphql/models/nationalRegistrySpouse.model'
import { Inject } from '@nestjs/common'
import { Address } from './graphql/models/nationalRegistryAddress.model'
import { Birthplace } from './graphql/models/nationalRegistryBirthplace.model'
import { Citizenship } from './graphql/models/nationalRegistryCitizenship.model'
import { Name } from './graphql/models/nationalRegistryName.model'
import { Religion } from './graphql/models/nationalRegistryReligion.model'
import { Custodian } from './graphql/models/nationalRegistryCustodian.model'
import { DomicilePopulace } from './graphql/models/nationalRegistryDomicilePopulace.model'

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
        familyRegistrationCode: data.logheimilistengsl?.logheimilistengsl,
        banMarking: data.bannmerking === 'true',
        fate: data.afdrif,
      }
    )
  }

  async getNationalRegistryPerson(nationalId: string): Promise<Person | null> {
    const person = await this.fetchData(nationalId)

    return this.extractPerson(person)
  }

  async getAddress(nationalId: string): Promise<Address | null> {
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

  async getParents(nationalId: string): Promise<Array<Person> | null> {
    const data = await this.fetchData(nationalId)

    if (!data.logforeldrar?.logForeldrar) {
      return null
    }

    const parentData: Array<Person | null> =
      (await Promise.all(
        data.logforeldrar?.logForeldrar
          .map(async (parent) => {
            if (!parent.logForeldriKennitala || !parent.logForeldriNafn) {
              return null
            }
            const personData = await this.fetchData(parent.logForeldriKennitala)
            return {
              ...this.extractPerson(personData),
              nationalId: parent.logForeldriKennitala,
              fullName: parent.logForeldriNafn,
            }
          })
          .filter((Boolean as unknown) as ExcludesFalse),
      )) ?? []

    return parentData.filter((parent): parent is Person => parent != null)
  }

  async getCustodians(nationalId: string): Promise<Array<Custodian> | null> {
    const data = await this.fetchData(nationalId)

    if (!data.forsja || !data.forsja.forsjaradilar) {
      return null
    }

    const custodianData: Array<Custodian | null> =
      (await Promise.all(
        data.forsja.forsjaradilar
          .map(async (custodian) => {
            if (!custodian.forsjaAdiliKennitala || !custodian.forsjaAdiliNafn) {
              return null
            }
            const custodianData = await this.fetchData(
              custodian.forsjaAdiliKennitala,
            )
            return {
              ...this.extractPerson(custodianData),
              nationalId: custodian.forsjaAdiliKennitala,
              fullName: custodian.forsjaAdiliNafn,
              custodyText: custodian.forsjaTexti,
              livesWithChild: custodianData.logheimilistengsl?.logheimilismedlimir
                ?.map((l) => l.kennitala)
                .includes(data.kennitala),
            }
          })
          .filter((Boolean as unknown) as ExcludesFalse),
      )) ?? []

    return custodianData.filter(
      (custodian): custodian is Custodian => custodian != null,
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

  async getSpouse(nationalId: string): Promise<Spouse | null> {
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

  async getDomicilePopulace(
    nationalId: string,
  ): Promise<DomicilePopulace | null> {
    const data = await this.fetchData(nationalId)

    return (
      (data.logheimilistengsl &&
        ({
          legalDomicileId: data.logheimilistengsl.logheimilistengsl,
          populace: data.logheimilistengsl.logheimilismedlimir?.map(
            (person) => ({
              nationalId: person.kennitala,
              name: person.nafn,
            }),
          ),
        } as DomicilePopulace)) ??
      null
    )
  }

  async getCitizenship(nationalId: string): Promise<Citizenship | null> {
    const data = await this.fetchData(nationalId)

    return (
      (data.rikisfang && {
        name: data.rikisfang.rikisfangLand,
        code: data.rikisfang.rikisfangKodi,
      }) ??
      null
    )
  }

  async getChildren(nationalId: string): Promise<Array<Person> | null> {
    const parentData = await this.fetchData(nationalId)

    const children = parentData.forsja?.born?.length
      ? parentData.forsja.born
      : []

    const childDetails: Array<Person | null> = await Promise.all(
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

        const parents = (await this.getParents(child.barnKennitala)) ?? []
        const custodians = (await this.getCustodians(child.barnKennitala)) ?? []

        const livesWithApplicant = childDetails.logheimilistengsl?.logheimilismedlimir
          ?.map((l) => l.kennitala)
          .includes(parentData.kennitala)

        return {
          ...this.extractPerson(childDetails),
          nationalId: child.barnKennitala,
          fullName: child.barnNafn,
          parents,
          custodians,
          livesWithApplicant,
          livesWithBothParents:
            livesWithApplicant &&
            otherParentsDetails.every(
              (o) =>
                o?.logheimilistengsl?.logheimilistengsl ===
                childDetails.logheimilistengsl?.logheimilistengsl,
            ),
          otherParent:
            otherParentsDetails.length && otherParentsDetails[0]
              ? this.extractPerson(otherParentsDetails[0])
              : null,
        }
      }),
    )

    return childDetails.filter((child): child is Person => child != null)
  }

  async getBirthplace(nationalId: string): Promise<Birthplace | null> {
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

  async getName(nationalId: string): Promise<Name | null> {
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

  async getReligion(nationalId: string): Promise<Religion | null> {
    const data = await this.fetchData(nationalId)

    return (
      (data.trufelag && {
        name: data.trufelag.trufelagHeiti,
      }) ??
      null
    )
  }
}
