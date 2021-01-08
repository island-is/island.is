import { UseGuards } from '@nestjs/common'
import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql'
import * as kennitala from 'kennitala'

import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User as AuthUser,
} from '@island.is/auth-nest-tools'

import { NationalRegistryUser } from './models'
import { NationalRegistryService } from '../nationalRegistry.service'
import { User } from '../types'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver(() => NationalRegistryUser)
export class UserResolver {
  constructor(
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  @Query(() => NationalRegistryUser, {
    name: 'nationalRegistryUser',
    nullable: true,
  })
  user(@CurrentUser() user: AuthUser): Promise<User> {
    return this.nationalRegistryService.getUser(user.nationalId)
  }

  @ResolveField('citizenship', () => String)
  resolveCitizenship(@Parent() user: User): string {
    return user.citizenship.name
  }

  @ResolveField('legalResidence', () => String)
  resolveLegalResidence(@Parent() { address }: User): string {
    return `${address.streetAddress}, ${address.postalCode} ${address.city}`
  }

  @ResolveField('birthPlace', () => String)
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
