import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { UserProfile } from './userProfile.model'
import { ConfirmResponse, Response } from './response.model'
import { UserProfileService } from './userProfile.service'
import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-api-lib'
import { UseGuards } from '@nestjs/common'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class UserProfileResolver {
  constructor(private readonly userUserProfileService: UserProfileService) {}
  @Query(() => UserProfile, { nullable: true })
  getUserProfile(@CurrentUser() user: User): Promise<UserProfile | null> {
    return this.userUserProfileService.getUser(user.nationalId)
  }

  @Mutation(() => UserProfile, { nullable: true })
  createProfile(
    @Args('input') input: CreateUserProfileInput,
    @CurrentUser() user: User,
  ): Promise<UserProfile | null> {
    return this.userUserProfileService.createUser(input, user.nationalId)
  }

  @Mutation(() => UserProfile, { nullable: true })
  updateProfile(
    @Args('input') input: UpdateUserProfileInput,
    @CurrentUser() user: User,
  ): Promise<UserProfile | null> {
    return this.userUserProfileService.updateUser(input, user.nationalId)
  }

  @Mutation(() => Response, { nullable: true })
  async createSmsVerification(
    @Args('input') input: CreateSmsVerificationInput,
    @CurrentUser() user: User,
  ): Promise<Response> {
    await this.userUserProfileService.createSmsVerification(
      input,
      user.nationalId,
    )
    return Promise.resolve({ created: true })
  }

  @Mutation(() => ConfirmResponse, { nullable: true })
  async confirmSmsVerification(
    @Args('input') input: ConfirmSmsVerificationInput,
    @CurrentUser() user: User,
  ): Promise<ConfirmResponse> {
    return await this.userUserProfileService.confirmSms(input, user.nationalId)
  }

  @Mutation(() => ConfirmResponse, { nullable: true })
  async confirmEmailVerification(
    @Args('input') input: ConfirmEmailVerificationInput,
    @CurrentUser() user: User,
  ): Promise<ConfirmResponse | null> {
    return await this.userUserProfileService.confirmEmail(
      input,
      user.nationalId,
    )
  }
}
