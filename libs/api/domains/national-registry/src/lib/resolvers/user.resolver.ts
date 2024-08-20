import { UseGuards } from '@nestjs/common'
import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql'
import * as kennitala from 'kennitala'

import { ApiScope } from '@island.is/auth/scopes'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { User } from '../v3/types'
import { NationalRegistryUser } from '../shared/models/user.model'
import { Citizenship } from '../shared/models/citizenship.model'
import { NationalRegistryService } from '../nationalRegistry.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => NationalRegistryUser)
@Audit({ namespace: '@island.is/api/national-registry' })
export class UserResolver {
  constructor(private readonly service: NationalRegistryService) {}

  @Query(() => NationalRegistryUser, {
    name: 'nationalRegistryUser',
    nullable: true,
    deprecationReason: 'Moving to NationalRegistryPerson',
  })
  @Audit()
  async user(@CurrentUser() user: AuthUser): Promise<User | null> {
    return this.service.getUser(user.nationalId)
  }

  @ResolveField('citizenship', () => Citizenship, { nullable: true })
  resolveCitizenship(@Parent() user: User): Citizenship | null {
    return user.citizenship ?? null
  }

  @ResolveField('legalResidence', () => String, { nullable: true })
  resolveLegalResidence(@Parent() { address }: User): string | null {
    if (address && address.streetAddress && address.postalCode) {
      return `${address.streetAddress}, ${address.postalCode} ${address.city}`
    }
    return null
  }

  @ResolveField('birthPlace', () => String, { nullable: true })
  resolveBirthPlace(@Parent() { birthPlace }: User): string | null {
    return birthPlace.city ?? null
  }

  @ResolveField('age', () => Number)
  resolveAge(@Parent() { nationalId }: User): number {
    return kennitala.info(nationalId).age
  }

  @ResolveField('birthday', () => Date)
  resolveBirthday(@Parent() { nationalId }: User): Date {
    return kennitala.info(nationalId).birthday
  }
}
