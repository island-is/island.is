import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { IdentityClientService } from '@island.is/clients/identity'

import { UserProfileService } from './userProfile.service'
import { PaginatedUserProfileResponse } from './dto/paginated-user-profile.response'
import { AdminUserProfile } from './adminUserProfile.model'

@UseGuards(IdsUserGuard)
@Resolver(() => AdminUserProfile)
export class AdminUserProfileResolver {
  constructor(
    private readonly userUserProfileService: UserProfileService,
    private readonly identityService: IdentityClientService,
  ) {}

  @Query(() => AdminUserProfile, {
    nullable: true,
    name: 'UserProfileAdminProfile',
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
    name: 'UserProfileAdminProfiles',
  })
  getUserProfiles(@Args('query') query: string, @CurrentUser() user: User) {
    return this.userUserProfileService.getUserProfiles(user, query)
  }

  @ResolveField('fullName', () => String, { nullable: true })
  async getFullName(@Parent() adminUserProfile: AdminUserProfile) {
    const identity = await this.identityService.getIdentity(
      adminUserProfile.nationalId ?? '',
    )

    return identity?.name ?? ''
  }
}
