import { Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'

import { User } from '@island.is/auth-nest-tools'
import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'

import { IdentityType } from './identity.type'
import { Identity } from './models'

@Injectable()
export class IdentityService {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  async getIdentity(nationalId: string, user: User): Promise<Identity | null> {
    if (kennitala.isCompany(nationalId)) {
      return null
    }

    const person = await this.nationalRegistryXRoadService.getNationalRegistryPerson(
      nationalId,
      user.authorization,
    )
    return {
      nationalId: person.nationalId,
      name: person.fullName,
      address: person.address && {
        streetAddress: person.address.streetName,
        postalCode: person.address.postalCode,
        city: person.address.city,
      },
      type: IdentityType.Person,
    } as Identity
  }
}
