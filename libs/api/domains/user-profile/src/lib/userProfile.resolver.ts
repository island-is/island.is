import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { UserProfile } from './userProfile.model'
import { ConfirmResponse, Response } from './response.model'
import { UserProfileService } from './userProfile.service'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'

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

  @Mutation(() => Response, { nullable: true })
  async createSmsVerification(
    @Args('input') input: CreateSmsVerificationInput,
    @CurrentUser() user: User,
  ): Promise<Response> {
    await this.userUserProfileService.createSmsVerification(input, user)
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
}
