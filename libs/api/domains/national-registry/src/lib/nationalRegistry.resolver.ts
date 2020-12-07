import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'

import { NationalRegistryFamilyMember, NationalRegistryUser } from './models'
import { NationalRegistryService } from './nationalRegistry.service'
import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-api-lib'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class NationalRegistryResolver {
  constructor(private nationalRegistryService: NationalRegistryService) {}
  //Touching this
  @Query(() => NationalRegistryUser, {
    name: 'nationalRegistryUser',
    nullable: true,
  })
  getMyInfo(@CurrentUser() user: User): Promise<NationalRegistryUser | null> {
    return this.nationalRegistryService.GetMyinfo(user.nationalId)
  }

  @Query(() => [NationalRegistryFamilyMember], {
    name: 'nationalRegistryFamily',
    nullable: true,
  })
  getMyFamily(
    @CurrentUser() user: User,
  ): Promise<NationalRegistryFamilyMember[] | null> {
    return this.nationalRegistryService.GetMyFamily(user.nationalId)
  }
}
