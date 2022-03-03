import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { CreateEmailVerificationInput } from './dto/createEmalVerificationInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { DeleteIslykillValueInput } from './dto/deleteIslykillValueInput'
import { DeleteTokenResponse } from './dto/deleteTokenResponse'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { UserDeviceTokenInput } from './dto/userDeviceTokenInput'
import { DeleteIslykillSettings } from './models/deleteIslykillSettings.model'
import { ConfirmResponse, Response } from './response.model'
import { UserDeviceToken } from './userDeviceToken.model'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'

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
}
