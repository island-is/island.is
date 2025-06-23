import { Loader } from '@island.is/nest/dataloader'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

import { EmailsDto } from '@island.is/clients/user-profile'
import { ActorProfileDetails } from './dto/actorProfileDetails'
import { CreateEmailVerificationInput } from './dto/createEmalVerificationInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { DeleteIslykillValueInput } from './dto/deleteIslykillValueInput'
import { DeleteTokenResponse } from './dto/deleteTokenResponse'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { UserDeviceTokenInput } from './dto/userDeviceTokenInput'
import { DeleteIslykillSettings } from './models/deleteIslykillSettings.model'
import { Email } from './models/email.model'
import { UserProfileLocale } from './models/userProfileLocale.model'
import {
  EmailsLoader,
  type EmailsDataLoader,
} from './modules/user-emails/emails.loader'
import { Response } from './response.model'
import { UserDeviceToken } from './userDeviceToken.model'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'
import { UserProfileSetActorProfileEmailInput } from './dto/userProfileSetActorProfileEmail.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => UserProfile)
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

  @Mutation(() => ActorProfileDetails, {
    name: 'userProfileSetActorProfileEmail',
  })
  async setActorProfileEmail(
    @Args('input') input: UserProfileSetActorProfileEmailInput,
    @CurrentUser() user: User,
  ): Promise<ActorProfileDetails> {
    return this.userProfileService.userProfileSetActorProfileEmailById(
      input,
      user,
    )
  }

  @ResolveField('emails', () => [Email], { nullable: true })
  async getEmails(
    @Loader(EmailsLoader) emailsLoader: EmailsDataLoader,
  ): Promise<EmailsDto[]> {
    return emailsLoader.load('me')
  }

  @ResolveField('primaryEmail', () => Email, { nullable: true })
  async getPrimaryEmail(@Loader(EmailsLoader) emailsLoader: EmailsDataLoader) {
    const emails = await emailsLoader.load('me')

    return emails.find((email: EmailsDto) => email.primary) ?? null
  }
}
