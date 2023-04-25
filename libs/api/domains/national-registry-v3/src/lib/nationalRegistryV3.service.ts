import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryV3Person } from './graphql/models/nationalRegistryPerson.model'
import { User } from '@island.is/auth-nest-tools'
import { ChildGuardianship } from './graphql/models/nationalRegistryChildGuardianship.model'
import { NationalRegistryV3Spouse } from './graphql/models/nationalRegistrySpouse.model'
import { Inject } from '@nestjs/common'

type ExcludesFalse = <T>(x: T | null | undefined | '') => x is T

export class NationalRegistryV3Service {
  constructor(
    private nationalRegistryApi: NationalRegistryV3ClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private fetchData = (nationalId: string) =>
    this.nationalRegistryApi.getGerviData(nationalId)

  async getNationalRegistryPerson(
    nationalId: string,
  ): Promise<NationalRegistryV3Person | null> {
    const person = await this.fetchData(nationalId)

    if (!person.kennitala || !person.nafn) {
      return null
    }

    return (
      person && {
        nationalId: person.kennitala,
        fullName: person.nafn,
        address: person.heimilisfang && {
          streetName: person.heimilisfang.husHeiti ?? '',
          postalCode: person.heimilisfang.postnumer,
          city: person.heimilisfang.poststod,
          municipalityText: person.heimilisfang.sveitarfelag,
        },
        genderCode: person.pakkiD?.kynKodi,
      }
    )
  }

  async getChildGuardianship(
    user: User,
    childNationalId: string,
  ): Promise<ChildGuardianship | null> {
    const data = await this.fetchData(user.nationalId)

    if (!data.pakkiF?.born) {
      return null
    }

    const childrenNationalIds = data.pakkiF.born.map((b) => b.barnKennitala)

    const isChildOfUser = childrenNationalIds.some(
      (childId) => childId === childNationalId,
    )

    if (!isChildOfUser) {
      return null
    }

    const childData = await this.fetchData(childNationalId)

    const legalDomicileParent = childData.pakkiL?.logForeldrar
      ? childData.pakkiL?.logForeldrar
          .map((l) => l.logForeldriKennitala)
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
      (data.pakkiC && {
        nationalId: data.pakkiC.makiKennitala,
        name: data.pakkiC.makiNafn,
        maritalStatus: data.pakkiC.hjuskaparstadaKodi,
      }) ??
      null
    )
  }
}
