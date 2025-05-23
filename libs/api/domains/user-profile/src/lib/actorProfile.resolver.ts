import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { IdentityClientService } from '@island.is/clients/identity'

import { UserProfileServiceV2 } from './V2/userProfile.service'
import { ActorProfile, ActorProfileResponse } from './dto/actorProfile'
import { ActorProfileDetails } from './dto/actorProfileDetails'
import { UpdateActorProfileInput } from './dto/updateActorProfileInput'
import { UserProfileService } from './userProfile.service'

@UseGuards(IdsUserGuard)
@Resolver(() => ActorProfile)
export class ActorProfileResolver {
  constructor(
    private readonly userProfileServiceV2: UserProfileServiceV2,
    private readonly userUserProfileService: UserProfileService,
    private identityService: IdentityClientService,
  ) {}

  @Query(() => ActorProfileResponse, { name: 'userProfileActorProfiles' })
  actorProfiles(@CurrentUser() user: User): Promise<ActorProfileResponse> {
    return this.userUserProfileService.getActorProfiles(user)
  }

  @Query(() => ActorProfileDetails, { name: 'userProfileActorProfile' })
  actorProfile(@CurrentUser() user: User): Promise<ActorProfileDetails> {
    return this.userProfileServiceV2.getActorProfile(user)
  }

  @Mutation(() => ActorProfile, {
    name: 'userProfileUpdateActorProfile',
  })
  async updateActorProfile(
    @Args('input') input: UpdateActorProfileInput,
    @CurrentUser() user: User,
  ): Promise<ActorProfile> {
    return this.userUserProfileService.updateActorProfile(input, user)
  }

  @ResolveField('fromName', () => String, { nullable: true })
  async resolveFromName(
    @Parent() actorProfile: ActorProfile,
  ): Promise<string | null> {
    return this.identityService
      .getIdentity(actorProfile.fromNationalId)
      .then((identity) => identity?.name ?? null)
  }
}
