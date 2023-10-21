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

import { SoffiaService } from '../v1/soffia.service'
import { User } from '../v1/types'
import { NationalRegistryUser } from '../shared/models/user.model'
import { Citizenship } from '../shared/models/citizenship.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => NationalRegistryUser)
@Audit({ namespace: '@island.is/api/national-registry' })
export class UserResolver {
  constructor(private readonly soffiaService: SoffiaService) {}

  @Query(() => NationalRegistryUser, {
    name: 'nationalRegistryUser',
    nullable: true,
    deprecationReason: 'Moving to NationalRegistryPerson',
  })
  @Audit()
  user(@CurrentUser() user: AuthUser): Promise<User> {
    return this.soffiaService.getUser(user.nationalId)
  }

  @ResolveField('citizenship', () => Citizenship, { nullable: true })
  resolveCitizenship(@Parent() user: User): Citizenship {
    return user.citizenship
  }

  @ResolveField('legalResidence', () => String, { nullable: true })
  resolveLegalResidence(@Parent() { address }: User): string {
    return `${address.streetAddress}, ${address.postalCode} ${address.city}`
  }

  @ResolveField('birthPlace', () => String, { nullable: true })
  resolveBirthPlace(@Parent() { birthPlace }: User): string {
    return birthPlace.city
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
