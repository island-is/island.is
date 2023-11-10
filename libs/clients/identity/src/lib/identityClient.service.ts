import { Inject, Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'

import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { IdentityType } from './types/identityType'
import { Identity } from './types/identity'

type FallbackIdentity = Partial<Omit<Identity, 'nationalId' | 'type'>>

@Injectable()
export class IdentityClientService {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryClientService,
    private nationalRegistryV3: NationalRegistryV3ClientService,
    private rskCompanyInfoService: CompanyRegistryClientService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  async getIdentity(nationalId: string): Promise<Identity | null> {
    if (kennitala.isCompany(nationalId)) {
      return this.getCompanyIdentity(nationalId)
    } else {
      return this.getPersonIdentity(nationalId)
    }
  }

  async getIdentity2(nationalId: string): Promise<Identity | null> {
    if (kennitala.isCompany(nationalId)) {
      return this.getCompanyIdentity(nationalId)
    } else {
      return this.getPersonIdentity2(nationalId)
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
    const company = await this.rskCompanyInfoService.getCompany(nationalId)

    if (!company) {
      return null
    }

    return {
      type: IdentityType.Company,
      name: company.name,
      nationalId: company.nationalId,
      address: company?.address && {
        streetAddress: company.address.streetAddress,
        postalCode: company.address.postalCode,
        city: company.address.locality,
      },
    }
  }

  private async getPersonIdentity(
    nationalId: string,
  ): Promise<Identity | null> {
    const person = await this.nationalRegistryXRoadService.getIndividual(
      nationalId,
    )

    if (!person) {
      return null
    }

    return {
      nationalId: person.nationalId,
      name: person.name,
      givenName: person.givenName,
      familyName: person.familyName,
      address: person.legalDomicile && {
        streetAddress: person.legalDomicile.streetAddress,
        postalCode: person.legalDomicile.postalCode,
        city: person.legalDomicile.locality,
      },
      type: IdentityType.Person,
    } as Identity
  }

  private async getPersonIdentity2(
    nationalId: string,
  ): Promise<Identity | null> {
    const data = await this.nationalRegistryV3.getAllDataIndividual(nationalId)
    const name = await this.nationalRegistryV3.getName(nationalId)

    if (!data || !name) {
      return null
    }

    return {
      nationalId: data.kennitala,
      name: data.nafn,
      givenName: name.eiginNafn,
      familyName: name.kenniNafn,
      address: data.heimilisfang && {
        streetAddress: data.heimilisfang.husHeiti,
        postalCode: data.heimilisfang.postnumer,
        city: data.heimilisfang.poststod,
      },
      type: IdentityType.Person,
    } as Identity
  }
}
