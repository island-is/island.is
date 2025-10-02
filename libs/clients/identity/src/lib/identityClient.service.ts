import { Inject, Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'

import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { IdentityType } from './types/identityType'
import { Identity } from './types/identity'

type FallbackIdentity = Partial<Omit<Identity, 'nationalId' | 'type'>>

@Injectable()
export class IdentityClientService {
  constructor(
    private nationalRegistryService: NationalRegistryV3ClientService,
    private rskCompanyInfoService: CompanyRegistryClientService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  async getIdentity(
    nationalId: string,
    actorNationalId?: string,
  ): Promise<Identity | null> {
    if (kennitala.isCompany(nationalId)) {
      return this.getCompanyIdentity(nationalId, actorNationalId)
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

  async tryToGetNameFromNationalId(
    nationalId: string,
    returnWithNationalId?: boolean,
  ): Promise<string | undefined> {
    try {
      const identity = await this.getIdentity(nationalId)

      return identity?.name
        ? returnWithNationalId
          ? `${identity?.name} (${kennitala.format(nationalId)})`
          : identity?.name
        : undefined
    } catch (error) {
      this.logger.error('Error getting identity', error)
      return undefined
    }
  }

  private async getCompanyIdentity(
    nationalId: string,
    actorNationalId?: string,
  ): Promise<Identity | null> {
    const company = await this.rskCompanyInfoService.getCompany(nationalId)

    if (!company) {
      return null
    }

    const actor = actorNationalId
      ? await this.getPersonIdentity(actorNationalId)
      : null

    return {
      type: IdentityType.Company,
      name: company.name,
      nationalId: company.nationalId,
      address: company?.address && {
        streetAddress: company.address.streetAddress,
        postalCode: company.address.postalCode,
        city: company.address.locality,
      },
      actor: actor
        ? { nationalId: actor.nationalId, name: actor.name }
        : undefined,
    }
  }

  private async getPersonIdentity(
    nationalId: string,
  ): Promise<Identity | null> {
    const person = await this.nationalRegistryService.getAllDataIndividual(
      nationalId,
    )

    if (!person) {
      return null
    }

    return {
      nationalId: person.kennitala,
      givenName: person.fulltNafn?.eiginNafn ?? null,
      familyName: person.fulltNafn?.kenniNafn ?? null,
      name: person.nafn,
      address: person.heimilisfang && {
        streetAddress: person.heimilisfang.husHeiti,
        postalCode: person.heimilisfang.postnumer,
        city: person.heimilisfang.sveitarfelag,
      },
      type: IdentityType.Person,
    } as Identity
  }
}
