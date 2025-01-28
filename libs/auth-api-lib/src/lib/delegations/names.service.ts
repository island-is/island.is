import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import type { User } from '@island.is/auth-nest-tools'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'

import { DelegationConfig } from './DelegationConfig'

@Injectable()
export class NamesService {
  private readonly authFetch: EnhancedFetchAPI

  constructor(
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
    private nationalRegistryClient: NationalRegistryV3ClientService,
  ) {
    this.authFetch = createEnhancedFetch({ name: 'delegation-auth-client' })
  }
  async getUserName(user: User) {
    const response = await this.authFetch(this.delegationConfig.userInfoUrl, {
      headers: {
        Authorization: user.authorization,
      },
    })
    const userinfo = (await response.json()) as { name: string }
    return userinfo.name
  }

  async getPersonName(nationalId: string) {
    const person = await this.nationalRegistryClient.getAllDataIndividual(
      nationalId,
    )
    if (!person) {
      throw new BadRequestException(
        `A person with nationalId<${nationalId}> could not be found`,
      )
    }
    return person.nafn ?? ''
  }
}
