import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
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
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { UserDeviceToken } from './userDeviceToken.model'
import { UserDeviceTokenInput } from './dto/userDeviceTokenInput'
import { DeleteTokenResponse } from './dto/deleteTokenResponse'
import { UserProfileLocale } from './models/userProfileLocale.model'
import { UpdateEmailNotificationsInput } from './dto/updateEmailNotificationsInput'
import { V2UserProfile } from './V2UserProfile.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class UserProfileResolver {
  constructor(private readonly userUserProfileService: UserProfileService) {}

  @Query(() => UserProfile, { nullable: true })
  getUserProfile(
    @CurrentUser() user: User,
  ): Promise<UserProfile | null | undefined> {
    return this.userUserProfileService.getUserProfile(user)
  }

  @Query(() => UserProfileLocale, { nullable: true })
  getUserProfileLocale(
    @CurrentUser() user: User,
  ): Promise<UserProfileLocale | undefined> {
    return this.userUserProfileService.getUserProfileLocale(user)
  }

  @Mutation(() => UserProfile, { nullable: true })
  createProfile(
    @Args('input') input: CreateUserProfileInput,
    @CurrentUser() user: User,
  ): Promise<UserProfile | null> {
    return this.userUserProfileService.createUserProfile(input, user)
  }

  @Mutation(() => UserProfile, { nullable: true })
  updateProfile(
    @Args('input') input: UpdateUserProfileInput,
    @CurrentUser() user: User,
  ): Promise<UserProfile | null> {
    return this.userUserProfileService.updateUserProfile(input, user)
  }

  @Mutation(() => UserProfile, { nullable: true })
  async deleteIslykillValue(
    @Args('input') input: DeleteIslykillValueInput,
    @CurrentUser() user: User,
  ): Promise<DeleteIslykillSettings> {
    return this.userUserProfileService.deleteIslykillValue(input, user)
  }

  @Mutation(() => Response, { nullable: true })
  async createSmsVerification(
    @Args('input') input: CreateSmsVerificationInput,
    @CurrentUser() user: User,
  ): Promise<Response> {
    await this.userUserProfileService.createSmsVerification(input, user)
    return Promise.resolve({ created: true })
  }

  @Mutation(() => Response, { nullable: true })
  async createEmailVerification(
    @Args('input') input: CreateEmailVerificationInput,
    @CurrentUser() user: User,
  ): Promise<Response> {
    await this.userUserProfileService.createEmailVerification(input, user)
    return Promise.resolve({ created: true })
  }

  @Mutation(() => Response, { nullable: true })
  async resendEmailVerification(@CurrentUser() user: User): Promise<Response> {
    await this.userUserProfileService.resendEmailVerification(user)
    return Promise.resolve({ created: true })
  }

  @Mutation(() => ConfirmResponse, { nullable: true })
  async confirmSmsVerification(
    @Args('input') input: ConfirmSmsVerificationInput,
    @CurrentUser() user: User,
  ): Promise<ConfirmResponse> {
    return await this.userUserProfileService.confirmSms(input, user)
  }

  @Mutation(() => ConfirmResponse, { nullable: true })
  async confirmEmailVerification(
    @Args('input') input: ConfirmEmailVerificationInput,
    @CurrentUser() user: User,
  ): Promise<ConfirmResponse | null> {
    return await this.userUserProfileService.confirmEmail(input, user)
  }

  @Mutation(() => UserDeviceToken)
  async addUserProfileDeviceToken(
    @Args('input') input: UserDeviceTokenInput,
    @CurrentUser() user: User,
  ): Promise<UserDeviceToken> {
    return await this.userUserProfileService.addDeviceToken(input, user)
  }

  @Mutation(() => DeleteTokenResponse)
  async deleteUserProfileDeviceToken(
    @Args('input') input: UserDeviceTokenInput,
    @CurrentUser() user: User,
  ): Promise<DeleteTokenResponse> {
    return await this.userUserProfileService.deleteDeviceToken(input, user)
  }

  @Mutation(() => V2UserProfile, { name: 'updateEmailNotifications' })
  async updateEmailNotifications(
    @Args('input') input: UpdateEmailNotificationsInput,
    @CurrentUser() user: User,
  ): Promise<V2UserProfile> {
    return await this.userUserProfileService.updateEmailNotifications(
      input,
      user,
    )
  }
}
