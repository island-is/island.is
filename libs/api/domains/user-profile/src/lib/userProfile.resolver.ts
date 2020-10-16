import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { GetUserProfileInput } from './dto/getUserProfileInput'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'

@Resolver()
export class UserProfileResolver {
  constructor(private readonly userUserProfileService: UserProfileService) {}

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
}
