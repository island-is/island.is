import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'

import { NationalRegistryFamilyMember, NationalRegistryUser } from './models'
import { NationalRegistryService } from './nationalRegistry.service'
import { User, FamilyMember } from './types'
import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User as AuthUser,
} from '@island.is/auth-nest-tools'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class NationalRegistryResolver {
  constructor(private nationalRegistryService: NationalRegistryService) {}
  //Touching this
  @Query(() => NationalRegistryUser, {
    name: 'nationalRegistryUser',
    nullable: true,
  })
  getMyInfo(@CurrentUser() user: AuthUser): Promise<User> {
    return this.nationalRegistryService.GetMyinfo(user.nationalId)
  }

  @Query(() => [NationalRegistryFamilyMember], {
    name: 'nationalRegistryFamily',
    nullable: true,
  })
  getMyFamily(@CurrentUser() user: AuthUser): Promise<FamilyMember[]> {
    return this.nationalRegistryService.GetMyFamily(user.nationalId)
  }
}
