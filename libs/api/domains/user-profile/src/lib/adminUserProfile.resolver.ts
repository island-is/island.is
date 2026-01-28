import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { IdentityClientService } from '@island.is/clients/identity'

import { AdminUserProfile } from './adminUserProfile.model'
import { PaginatedUserProfileResponse } from './dto/paginated-user-profile.response'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { UserProfileService } from './userProfile.service'
import { Email } from './models/email.model'
import { DataStatus } from './types/dataStatus.enum'

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

  @Mutation(() => AdminUserProfile, {
    nullable: false,
    name: 'UserProfileAdminUpdateProfile',
  })
  async updateUserProfile(
    @Args('nationalId') nationalId: string,
    @Args('input') input: UpdateUserProfileInput,
    @CurrentUser() user: User,
  ): Promise<AdminUserProfile> {
    return this.userUserProfileService.updateUserProfile(
      input,
      user,
      nationalId,
    )
  }

  @Mutation(() => Boolean, {
    nullable: false,
    name: 'UserProfileAdminDeleteEmail',
  })
  async deleteEmail(
    @Args('nationalId') nationalId: string,
    @Args('emailId') emailId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.userUserProfileService.deleteEmail(user, nationalId, emailId)
  }

  @ResolveField('fullName', () => String, { nullable: true })
  async getFullName(@Parent() adminUserProfile: AdminUserProfile) {
    const identity = await this.identityService.getIdentity(
      adminUserProfile.nationalId ?? '',
    )

    return identity?.name ?? ''
  }

  @ResolveField('emails', () => [Email], { nullable: true })
  async getEmails(
    @Parent() adminUserProfile: AdminUserProfile,
    @CurrentUser() user: User,
  ): Promise<Email[]> {
    if (!adminUserProfile.nationalId) {
      return []
    }

    return this.userUserProfileService.getEmailsByNationalId(
      user,
      adminUserProfile.nationalId,
    )
  }
}
