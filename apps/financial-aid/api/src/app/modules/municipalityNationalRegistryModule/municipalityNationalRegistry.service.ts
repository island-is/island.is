import { Inject, Injectable } from '@nestjs/common'

import { Auth, User } from '@island.is/auth-nest-tools'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { Person } from './models/person.model'
import { UserSpouse } from './models/userSpouse.model'

@Injectable()
export class MunicipalityNationalRegistryService {
  constructor(
    private nationalRegistryApi: NationalRegistryClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  nationalRegistryApiWithAuth(auth: Auth) {
    return this.nationalRegistryApi.withManualAuth(auth)
  }

  async getNationalRegistryPerson(
    user: User,
    nationalId: string,
  ): Promise<Person | null> {
    const person = await this.nationalRegistryApiWithAuth(user).getIndividual(
      nationalId,
    )

    return (
      person && {
        nationalId: person.nationalId,
        fullName: person.name,
        address: person.legalDomicile && {
          streetName: person.legalDomicile.streetAddress,
          postalCode: person.legalDomicile.postalCode,
          city: person.legalDomicile.locality,
          municipalityCode: person.legalDomicile.municipalityNumber,
        },
        genderCode: person.genderCode,
      }
    )
  }

  async getSpouse(user: User, nationalId: string): Promise<UserSpouse | null> {
    const spouse = await this.nationalRegistryApiWithAuth(
      user,
    ).getCohabitationInfo(nationalId)

    return (
      spouse && {
        nationalId: spouse.spouseNationalId,
        name: spouse.spouseName,
        maritalStatus: spouse.cohabitationCode,
      }
    )
  }
}
