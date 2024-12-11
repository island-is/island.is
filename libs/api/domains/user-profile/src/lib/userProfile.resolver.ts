import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { CreateEmailVerificationInput } from './dto/createEmalVerificationInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { DeleteIslykillValueInput } from './dto/deleteIslykillValueInput'
import { UserProfile } from './userProfile.model'
import { ConfirmResponse, Response } from './response.model'
import { DeleteIslykillSettings } from './models/deleteIslykillSettings.model'
import { UserProfileService } from './userProfile.service'
import { UserDeviceToken } from './userDeviceToken.model'
import { UserDeviceTokenInput } from './dto/userDeviceTokenInput'
import { DeleteTokenResponse } from './dto/deleteTokenResponse'
import { UserProfileLocale } from './models/userProfileLocale.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class UserProfileResolver {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Query(() => UserProfile, { nullable: true })
  getUserProfile(
    @CurrentUser() user: User,
  ): Promise<UserProfile | null | undefined> {
    return this.userProfileService.getUserProfile(user)
  }

  @Query(() => UserProfileLocale, { nullable: true })
  getUserProfileLocale(
    @CurrentUser() user: User,
  ): Promise<UserProfileLocale | undefined> {
    return this.userProfileService.getUserProfileLocale(user)
  }

  @Mutation(() => UserProfile, { nullable: true })
  createProfile(
    @Args('input') input: CreateUserProfileInput,
    @CurrentUser() user: User,
  ): Promise<UserProfile | null> {
    return this.userProfileService.createUserProfile(input, user)
  }

  @Mutation(() => UserProfile, { nullable: true })
  updateProfile(
    @Args('input') input: UpdateUserProfileInput,
    @CurrentUser() user: User,
  ): Promise<UserProfile | null> {
    return this.userProfileService.updateMeUserProfile(input, user)
  }

  @Mutation(() => UserProfile, { nullable: true })
  async deleteIslykillValue(
    @Args('input') input: DeleteIslykillValueInput,
    @CurrentUser() user: User,
  ): Promise<DeleteIslykillSettings> {
    return this.userProfileService.deleteIslykillValue(input, user)
  }

  @Mutation(() => Response, { nullable: true })
  async createSmsVerification(
    @Args('input') input: CreateSmsVerificationInput,
    @CurrentUser() user: User,
  ): Promise<Response> {
    await this.userProfileService.createSmsVerification(input, user)
    return Promise.resolve({ created: true })
  }

  @Mutation(() => Response, { nullable: true })
  async createEmailVerification(
    @Args('input') input: CreateEmailVerificationInput,
    @CurrentUser() user: User,
  ): Promise<Response> {
    await this.userProfileService.createEmailVerification(input, user)
    return Promise.resolve({ created: true })
  }

  @Mutation(() => Response, { nullable: true })
  async resendEmailVerification(@CurrentUser() user: User): Promise<Response> {
    await this.userProfileService.resendEmailVerification(user)
    return Promise.resolve({ created: true })
  }

  @Mutation(() => ConfirmResponse, { nullable: true })
  confirmSmsVerification(
    @Args('input') input: ConfirmSmsVerificationInput,
    @CurrentUser() user: User,
  ): Promise<ConfirmResponse> {
    return this.userProfileService.confirmSms(input, user)
  }

  @Mutation(() => ConfirmResponse, { nullable: true })
  confirmEmailVerification(
    @Args('input') input: ConfirmEmailVerificationInput,
    @CurrentUser() user: User,
  ): Promise<ConfirmResponse | null> {
    return this.userProfileService.confirmEmail(input, user)
  }

  @Mutation(() => UserDeviceToken)
  addUserProfileDeviceToken(
    @Args('input') input: UserDeviceTokenInput,
    @CurrentUser() user: User,
  ): Promise<UserDeviceToken> {
    return this.userProfileService.addDeviceToken(input, user)
  }

  @Mutation(() => DeleteTokenResponse)
  deleteUserProfileDeviceToken(
    @Args('input') input: UserDeviceTokenInput,
    @CurrentUser() user: User,
  ): Promise<DeleteTokenResponse> {
    return this.userProfileService.deleteDeviceToken(input, user)
  }

  @Mutation(() => Boolean, { name: 'userProfileConfirmNudge' })
  async confirmNudge(@CurrentUser() user: User): Promise<boolean> {
    await this.userProfileService.confirmNudge(user)
    return true
  }
}
