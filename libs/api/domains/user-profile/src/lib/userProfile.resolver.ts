import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { GetUserProfileInput } from './dto/getUserProfileInput'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { UserProfile } from './userProfile.model'
import { ConfirmResponse, Response } from './response.model'
import { UserProfileService } from './userProfile.service'

@Resolver()
export class UserProfileResolver {
  constructor(private readonly userUserProfileService: UserProfileService) {}
  //Needs authentication
  @Query(() => UserProfile, { nullable: true })
  getUserProfile(
    @Args('input') input: GetUserProfileInput,
  ): Promise<UserProfile | null> {
    return this.userUserProfileService.getUser(input.nationalId)
  }

  @Mutation(() => UserProfile, { nullable: true })
  createProfile(
    @Args('input') input: CreateUserProfileInput,
  ): Promise<UserProfile | null> {
    return this.userUserProfileService.createUser(input)
  }

  @Mutation(() => UserProfile, { nullable: true })
  updateProfile(
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<UserProfile | null> {
    return this.userUserProfileService.updateUser(input)
  }

  @Mutation(() => Response, { nullable: true })
  async createSmsVerification(
    @Args('input') input: CreateSmsVerificationInput,
  ): Promise<Response> {
    await this.userUserProfileService.createSmsVerification(input)
    return Promise.resolve({ created: true })
  }

  @Mutation(() => ConfirmResponse, { nullable: true })
  async confirmSmsVerification(
    @Args('input') input: ConfirmSmsVerificationInput,
  ): Promise<ConfirmResponse> {
    return await this.userUserProfileService.confirmSms(input)
  }

  @Mutation(() => ConfirmResponse, { nullable: true })
  async confirmEmailVerification(
    @Args('input') input: ConfirmEmailVerificationInput,
  ): Promise<ConfirmResponse | null> {
    return await this.userUserProfileService.confirmEmail(input)
  }
}
