import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GetUserProfileInput } from './dto/getUserProfileInput';
import { UserProfile } from './userProfile.model';
import { UserProfileService } from './userProfile.service';

@Resolver()
export class UserProfileResolver {
  constructor(private readonly userUserProfileService: UserProfileService) { }

  @Query(() => UserProfile, { nullable: true })
  getUserProfile(
    @Args('input') input: GetUserProfileInput,
  ): Promise<UserProfile | null> {
    return this.userUserProfileService.getUser(input.nationalId)
  }
}
