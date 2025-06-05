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

import { ActorProfile, ActorProfileResponse } from './dto/actorProfile'
import { ActorProfileDetails } from './dto/actorProfileDetails'
import { SetActorProfileEmailInput } from './dto/setActorProfileEmail.input'
import { UserProfileService } from './userProfile.service'
import { UpdateActorProfileEmailInput } from './dto/updateActorProfileEmail.input'
import { ActorProfileEmail } from './dto/actorProfileEmail'
import { UserProfileUpdateActorProfileInput } from './dto/userProfileUpdateActorProfile.input'
import { ActorProfileEmailDto } from '@island.is/clients/user-profile'

@UseGuards(IdsUserGuard)
@Resolver(() => ActorProfile)
export class ActorProfileResolver {
  constructor(
    private readonly userProfileService: UserProfileService,
    private identityService: IdentityClientService,
  ) {}

  @Query(() => ActorProfileResponse, { name: 'userProfileActorProfiles' })
  actorProfiles(@CurrentUser() user: User): Promise<ActorProfileResponse> {
    return this.userProfileService.getActorProfiles(user)
  }

  @Query(() => ActorProfileDetails, { name: 'userProfileActorProfile' })
  actorProfile(@CurrentUser() user: User): Promise<ActorProfileDetails> {
    return this.userProfileService.getActorProfile(user)
  }

  @Mutation(() => ActorProfile, {
    name: 'userProfileUpdateActorProfile',
  })
  async updateActorProfile(
    @Args('input') input: UserProfileUpdateActorProfileInput,
    @CurrentUser() user: User,
  ): Promise<ActorProfile> {
    return this.userProfileService.updateActorProfile(input, user)
  }

  @Mutation(() => ActorProfileEmail, {
    name: 'updateActorProfileEmail',
  })
  async updateActorProfileEmail(
    @Args('input') input: UpdateActorProfileEmailInput,
    @CurrentUser() user: User,
    // TODO: This is a hax and we should fix the root cause of the code generated enum. The Return type should be ActorProfileEmail and not ActorProfileEmailDto
  ): Promise<ActorProfileEmailDto> {
    return this.userProfileService.updateActorProfileEmail(input, user)
  }

  @Mutation(() => ActorProfileEmail, {
    name: 'updateActorProfileEmailWithoutActor',
  })
  async updateActorProfileEmailWithoutActor(
    @Args('input') input: UpdateActorProfileEmailInput,
    @Args('fromNationalId') fromNationalId: string,
    @CurrentUser() user: User,
  ): Promise<ActorProfileEmailDto> {
    return this.userProfileService.updateActorProfileEmailWithoutActor(
      input,
      fromNationalId,
      user,
    )
  }

  @Mutation(() => ActorProfileDetails, {
    name: 'setActorProfileEmail',
  })
  async setActorProfileEmail(
    @Args('input') input: SetActorProfileEmailInput,
    @CurrentUser() user: User,
  ): Promise<ActorProfileDetails> {
    return this.userProfileService.setActorProfileEmail(input, user)
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
