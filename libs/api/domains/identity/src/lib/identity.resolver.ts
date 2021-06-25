import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import * as kennitala from 'kennitala'

import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '@island.is/api/domains/national-registry'
import type { User } from '@island.is/auth-nest-tools'

import { IdentityType } from './identity.type'
import { IdentityInput } from './identity.input'
import { Identity, IdentityPerson, IdentityCompany } from './models'

@UseGuards(IdsUserGuard)
@Resolver(() => IdentityPerson)
@Resolver(() => IdentityCompany)
export class IdentityResolver {
  constructor(private nationalRegistryService: NationalRegistryService) {}

  @Query(() => Identity, { name: 'identity', nullable: true })
  async getIdentity(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input: IdentityInput,
  ): Promise<Identity | null> {
    const nationalId = input?.nationalId || user.nationalId

    if (kennitala.isCompany(nationalId)) {
      // TODO: not supported for now
      return null
    }

    const person = await this.nationalRegistryService.getUser(nationalId)
    return {
      ...person,
      type: IdentityType.Person,
    } as Identity
  }

  @ResolveField('name', () => String)
  resolveName(@Parent() identity: Identity & NationalRegistryUser): string {
    if (identity.type === IdentityType.Person) {
      return identity.fullName
    }
    // TODO: need to handle companies
    return 'unknown'
  }
}
