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
  type User,
} from '@island.is/auth-nest-tools'
import { IdentityClientService } from '@island.is/clients/identity'

import { UserProfileService } from './userProfile.service'
import { ActorProfile, ActorProfileResponse } from './dto/actorProfile'
import { UpdateActorProfileInput } from './dto/updateActorProfileInput'
import { SetActorProfileEmailInput } from './dto/setActorProfileEmail.input'
import { UserEmailsService } from './modules/user-emails/userEmails.service'
import { UpdateActorProfileEmailInput } from './dto/updateActorProfileEmail.input'
import { ActorProfileDetails } from './dto/actorProfileDetails'

@UseGuards(IdsUserGuard)
@Resolver(() => ActorProfile)
export class ActorProfileResolver {
  constructor(
    private readonly userUserProfileService: UserProfileService,
    private readonly userEmailsService: UserEmailsService,
    private identityService: IdentityClientService,
  ) {}

  @Query(() => ActorProfileResponse, { name: 'userProfileActorProfiles' })
  actorProfiles(@CurrentUser() user: User): Promise<ActorProfileResponse> {
    return this.userUserProfileService.getActorProfiles(user)
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

  @Mutation(() => Boolean, {
    name: 'userProfileSetActorProfileEmail',
  })
  async setActorProfileEmail(
    @Args('input') input: SetActorProfileEmailInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.userEmailsService.setActorProfileEmail({
      emailId: input.emailId,
      user,
    })
  }

  @Mutation(() => ActorProfileDetails, {
    name: 'userProfileUpdateActorProfileEmail',
  })
  async updateActorProfileEmail(
    @Args('input') input: UpdateActorProfileEmailInput,
    @CurrentUser() user: User,
  ): Promise<ActorProfileDetails> {
    return this.userUserProfileService.updateActorProfileEmail(input, user)
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
