import { Inject, Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryClientPerson } from '@island.is/shared/types'

import { Person } from './models/person.model'
import { UserSpouse } from './models/userSpouse.model'

@Injectable()
export class MunicipalityNationalRegistryService {
  constructor(
    private nationalRegistryApi: EinstaklingarApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  nationalRegistryApiWithAuth(auth: Auth) {
    return this.nationalRegistryApi.withMiddleware(new AuthMiddleware(auth))
  }

  private handle404(error: FetchError) {
    if (error.status === 404) {
      return undefined
    }
    throw error
  }

  async getNationalRegistryPerson(
    user: User,
    nationalId: string,
  ): Promise<Person | undefined> {
    const response = await this.nationalRegistryApiWithAuth(user)
      .einstaklingarGetEinstaklingurRaw({ id: nationalId })
      .catch(this.handle404)

    // 2022-03-08: For some reason, the API now returns "204 No Content" when nationalId doesn't exist.
    // Should remove this after they've fixed their API to return "404 Not Found".
    const person: NationalRegistryClientPerson | undefined =
      response === undefined || response.raw.status === 204
        ? undefined
        : await response.value()

    return (
      person && {
        nationalId: person.kennitala,
        fullName: person.nafn,
        address: person.logheimili && {
          streetName: person.logheimili.heiti,
          postalCode: person.logheimili.postnumer,
          city: person.logheimili.stadur,
          municipalityCode: person.logheimili.sveitarfelagsnumer,
        },
        genderCode: person.kynkodi,
      }
    )
  }

  async getSpouse(
    user: User,
    nationalId: string,
  ): Promise<UserSpouse | undefined> {
    const spouse = await this.nationalRegistryApiWithAuth(user)
      .einstaklingarGetHjuskapur({ id: nationalId })
      .catch(this.handle404)

    return (
      spouse && {
        nationalId: spouse.kennitalaMaka,
        name: spouse.nafnMaka,
        maritalStatus: spouse.hjuskaparkodi,
      }
    )
  }
}
