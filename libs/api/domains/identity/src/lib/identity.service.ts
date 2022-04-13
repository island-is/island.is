import { Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'

import { User } from '@island.is/auth-nest-tools'
import { RskCompanyInfoService } from '@island.is/api/domains/company-registry'
import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'

import { IdentityType } from './identity.type'
import { Identity } from './models'

@Injectable()
export class IdentityService {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
    private rskCompanyInfoService: RskCompanyInfoService,
  ) {}

  async getIdentity(nationalId: string, user: User): Promise<Identity | null> {
    if (kennitala.isCompany(nationalId)) {
      return this.getCompanyIdentity(nationalId)
    } else {
      return this.getPersonIdentity(nationalId, user)
    }
  }

  private async getCompanyIdentity(
    nationalId: string,
  ): Promise<Identity | null> {
    const company = await this.rskCompanyInfoService.getCompanyInformationWithExtra(
      nationalId,
    )

    if (!company) {
      return null
    }

    return {
      type: IdentityType.Company,
      name: company.name,
      nationalId: company.nationalId,
    }
  }

  private async getPersonIdentity(
    nationalId: string,
    user: User,
  ): Promise<Identity | null> {
    const person = await this.nationalRegistryXRoadService.getNationalRegistryPerson(
      user,
      nationalId,
    )

    if (!person) {
      return null
    }

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
