import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import type { Locale } from '@island.is/shared/types'

import { HealthDirectorateService } from '../health-directorate.service'
import { HealthDirectorateCreateConversationInput } from '../dto/createHealthConversation.input'
import { HealthDirectorateReplyToConversationInput } from '../dto/replyToHealthConversation.input'
import { HealthDirectorateHealthConversation } from '../models/healthConversation.model'
import { HealthDirectorateHealthConversationDetail } from '../models/healthConversationDetail.model'
import { HealthDirectorateHealthConversationRecipient } from '../models/healthConversationRecipient.model'
import { HealthConversationStatusFilterEnum } from '../models/enums'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/health-directorate' })
@Resolver(() => HealthDirectorateHealthConversation)
export class HealthConversationsResolver {
  constructor(private api: HealthDirectorateService) {}

  @Query(() => [HealthDirectorateHealthConversation], {
    name: 'healthDirectorateHealthConversations',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  getHealthConversations(
    @Args('status', {
      type: () => HealthConversationStatusFilterEnum,
      nullable: true,
    })
    status: HealthConversationStatusFilterEnum | undefined,
    @Args('starred', { type: () => Boolean, nullable: true })
    starred: boolean | undefined,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthConversation[] | null> {
    return this.api.getHealthConversations(user, status, starred)
  }

  @Query(() => HealthDirectorateHealthConversationDetail, {
    name: 'healthDirectorateHealthConversation',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  getHealthConversation(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthConversationDetail | null> {
    return this.api.getHealthConversation(user, id)
  }

  @Query(() => [HealthDirectorateHealthConversationRecipient], {
    name: 'healthDirectorateHealthConversationRecipients',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  getHealthConversationRecipients(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthConversationRecipient[] | null> {
    return this.api.getHealthConversationRecipients(user, locale)
  }

  @Mutation(() => HealthDirectorateHealthConversationDetail, {
    name: 'healthDirectorateCreateHealthConversation',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  createHealthConversation(
    @Args('input') input: HealthDirectorateCreateConversationInput,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthConversationDetail | null> {
    return this.api.createHealthConversation(user, input)
  }

  @Mutation(() => HealthDirectorateHealthConversationDetail, {
    name: 'healthDirectorateReplyToHealthConversation',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  replyToHealthConversation(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: HealthDirectorateReplyToConversationInput,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthConversationDetail | null> {
    return this.api.replyToHealthConversation(user, id, input)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateMarkHealthConversationAsRead',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  markHealthConversationAsRead(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.markHealthConversationAsRead(user, id)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateArchiveHealthConversation',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  archiveHealthConversation(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.archiveHealthConversation(user, id)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateUnarchiveHealthConversation',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  unarchiveHealthConversation(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.unarchiveHealthConversation(user, id)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateStarHealthConversation',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  starHealthConversation(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.starHealthConversation(user, id)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateUnstarHealthConversation',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  unstarHealthConversation(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.unstarHealthConversation(user, id)
  }
}
