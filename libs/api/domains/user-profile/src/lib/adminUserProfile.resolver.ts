import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { IdentityClientService } from '@island.is/clients/identity'

import { UserProfileService } from './userProfile.service'
import { PaginatedUserProfileResponse } from './dto/paginated-user-profile.response'
import { UserProfile } from './userProfile.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => UserProfile)
export class AdminUserProfileResolver {
  constructor(
    private readonly userUserProfileService: UserProfileService,
    private readonly identityService: IdentityClientService,
  ) {}

  @Query(() => UserProfile, {
    nullable: true,
    name: 'GetUserProfileByNationalId',
  })
  getUserProfileByNationalId(
    @Args('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ) {
    return this.userUserProfileService.getUserProfileByNationalId(
      user,
      nationalId,
    )
  }

  @Query(() => PaginatedUserProfileResponse, {
    nullable: false,
    name: 'GetPaginatedUserProfiles',
  })
  getUserProfiles(@Args('query') query: string, @CurrentUser() user: User) {
    return this.userUserProfileService.getUserProfiles(user, query)
  }

  @ResolveField('fullName', () => String, { nullable: true })
  async getFullName(@Parent() userProfile: UserProfile) {
    return await this.identityService
      .getIdentity(userProfile.nationalId ?? '')
      .then((identity) => {
        return identity?.name
      })
  }
}
