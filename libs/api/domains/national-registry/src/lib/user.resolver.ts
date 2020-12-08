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

  @ResolveField('religion', () => String)
  resolveReligion(@Parent() user: User): Promise<string> {
    return this.nationalRegistryService.getReligion(user.nationalId)
  }

  @ResolveField('birthPlace', () => String)
  resolveBirthPlace(@Parent() user: User): Promise<string> {
    return this.nationalRegistryService.getBirthPlace(user.municipalCode)
  }

  @ResolveField('banMarking', () => String)
  resolveBanMarking(@Parent() user: User): Promise<string> {
    return this.nationalRegistryService.getBanMarking(user.nationalId)
  }

  @ResolveField('legalResidence', () => String)
  resolveLegalResidence(@Parent() user: User): Promise<string> {
    return this.nationalRegistryService.getLegalResidence(user.houseCode)
  }
}
