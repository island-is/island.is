import { Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'

import {
  NationalRegistryService,
  NationalRegistryUser,
} from '@island.is/api/domains/national-registry'

import { IdentityType } from './identity.type'
import { Identity } from './models'

@Injectable()
export class IdentityService {
  constructor(private nationalRegistryService: NationalRegistryService) {}

  async getIdentity(nationalId: string): Promise<Identity | null> {
    if (kennitala.isCompany(nationalId)) {
      return null
    }

    const person = await this.nationalRegistryService.getUser(nationalId)
    return {
      ...person,
      type: IdentityType.Person,
    } as Identity
  }
}
