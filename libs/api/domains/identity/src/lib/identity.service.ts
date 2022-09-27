import { Inject, Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'

import { RskCompanyInfoService } from '@island.is/api/domains/company-registry'
import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { IdentityType } from './identity.type'
import { Identity } from './models'

type FallbackIdentity = Partial<Omit<Identity, 'nationalId' | 'type'>>

@Injectable()
export class IdentityService {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
    private rskCompanyInfoService: RskCompanyInfoService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  async getIdentity(nationalId: string): Promise<Identity | null> {
    if (kennitala.isCompany(nationalId)) {
      return this.getCompanyIdentity(nationalId)
    } else {
      return this.getPersonIdentity(nationalId)
    }
  }

  async getIdentityWithFallback(
    nationalId: string,
    fallbackIdentity: FallbackIdentity,
  ): Promise<Identity> {
    let identity: Identity | null = null
    try {
      identity = await this.getIdentity(nationalId)
    } catch (error) {
      this.logger.error(
        'Failed getting identity, providing fallback value',
        error,
      )
    }

    return (
      identity ?? {
        nationalId,
        type: kennitala.isCompany(nationalId)
          ? IdentityType.Company
          : IdentityType.Person,
        name: fallbackIdentity.name ?? kennitala.format(nationalId),
        address: fallbackIdentity.address,
      }
    )
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
  ): Promise<Identity | null> {
    const person = await this.nationalRegistryXRoadService.getNationalRegistryPerson(
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
