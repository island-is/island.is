import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { IdentityClientService } from '@island.is/clients/identity'

import { UserProfileService } from './userProfile.service'
import { ActorProfile, ActorProfileResponse } from './dto/actorProfile'
import { UpdateActorProfileInput } from './dto/updateActorProfileInput'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => ActorProfile)
export class ActorProfileResolver {
  constructor(
    private readonly userUserProfileService: UserProfileService,
    private identityService: IdentityClientService,
  ) {}

  @Query(() => ActorProfileResponse, { name: 'userProfileActorProfiles' })
  getActorProfiles(@CurrentUser() user: User): Promise<ActorProfileResponse> {
    return this.userUserProfileService.getActorProfiles(user)
  }

  @Mutation(() => ActorProfile, {
    name: 'userProfileUpdateActorProfile',
  })
  async updateActorProfile(
    @Args('input') input: UpdateActorProfileInput,
    @CurrentUser() user: User,
  ): Promise<ActorProfile> {
    return await this.userUserProfileService.updateActorProfile(input, user)
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
