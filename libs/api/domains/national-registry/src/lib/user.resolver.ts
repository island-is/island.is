import { UseGuards } from '@nestjs/common'
import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql'

import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User as AuthUser,
} from '@island.is/auth-nest-tools'
import { NationalRegistryUser } from './models'
import { NationalRegistryService } from './nationalRegistry.service'
import { User } from './types'

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
    return this.nationalRegistryService.getUserInfo(user.nationalId)
  }
}
