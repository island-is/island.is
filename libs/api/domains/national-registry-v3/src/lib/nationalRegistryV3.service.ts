import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Person } from './graphql/models/nationalRegistryPerson.model'
import { Spouse } from './graphql/models/nationalRegistrySpouse.model'
import { Inject } from '@nestjs/common'
import { Address } from './graphql/models/nationalRegistryAddress.model'
import { Birthplace } from './graphql/models/nationalRegistryBirthplace.model'
import { Citizenship } from './graphql/models/nationalRegistryCitizenship.model'
import { Name } from './graphql/models/nationalRegistryName.model'
import { Religion } from './graphql/models/nationalRegistryReligion.model'
import { Custodian } from './graphql/models/nationalRegistryCustodian.model'

export class NationalRegistryV3Service {
  constructor(
    private nationalRegistryApi: NationalRegistryV3ClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getNationalRegistryPerson(nationalId: string): Promise<Person | null> {
    const person = await this.nationalRegistryApi.getIndividual(nationalId)

    return person && { ...person, fullName: person.name }
  }

  async getAddress(nationalId: string): Promise<Address | null> {
    const address = await this.nationalRegistryApi.getAddress(nationalId)

    return (
      address && {
        streetName: address.streetAddress,
        postalCode: address.postalCode,
        city: address.city,
        municipalityText: address.municipality,
      }
    )
  }
  /*
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
  }*/

  async getCustodians(nationalId: string): Promise<Array<Custodian> | null> {
    const data = await this.nationalRegistryApi.getCustodians(nationalId)

    return (
      data &&
      data.map(
        (custodian) =>
          ({
            nationalId: custodian.nationalId,
            name: custodian.name,
            custodyCode: custodian.custodyCode,
            custodyText: custodian.custodyText,
            livesWithChild: custodian.livesWithChild,
          } as Custodian),
      )
    )
  }

  /*
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
  }*/

  async getSpouse(nationalId: string): Promise<Spouse | null> {
    const data = await this.nationalRegistryApi.getSpouse(nationalId)

    return (
      data && {
        nationalId: data.nationalId,
        name: data.name,
        maritalStatus: data.maritalStatus,
        cohabitation: data.cohabitation,
      }
    )
  }

  async getCitizenship(nationalId: string): Promise<Citizenship | null> {
    const data = await this.nationalRegistryApi.getCitizenship(nationalId)

    return (
      data && {
        name: data.name,
        code: data.code,
      }
    )
  }

  /*
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
  }*/

  async getBirthplace(nationalId: string): Promise<Birthplace | null> {
    const data = await this.nationalRegistryApi.getBirthplace(nationalId)

    return (
      data && {
        location: data.location,
        municipalityCode: data.municipalityCode,
        dateOfBirth: data.dateOfBirth ?? undefined,
      }
    )
  }

  async getName(nationalId: string): Promise<Name | null> {
    const data = await this.nationalRegistryApi.getName(nationalId)

    return (
      data && {
        givenName: data.givenName,
        middleName: data.middleName,
        lastName: data.lastName,
      }
    )
  }

  async getReligion(nationalId: string): Promise<Religion | null> {
    const data = await this.nationalRegistryApi.getReligion(nationalId)

    return (
      data && {
        name: data.name,
      }
    )
  }
}
