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
import { HealthDirectorateCreateMessageInput } from '../dto/createHealthMessage.input'
import { HealthDirectorateReplyToMessageInput } from '../dto/replyToHealthMessage.input'
import { HealthDirectorateHealthMessage } from '../models/healthMessage.model'
import { HealthDirectorateHealthMessageDetail } from '../models/healthMessageDetail.model'
import { HealthDirectorateHealthMessagingRecipient } from '../models/healthMessagingRecipient.model'
import { HealthMessageStatusFilterEnum } from '../models/enums'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/health-directorate' })
@Resolver(() => HealthDirectorateHealthMessage)
export class HealthMessagesResolver {
  constructor(private api: HealthDirectorateService) {}

  @Query(() => [HealthDirectorateHealthMessage], {
    name: 'healthDirectorateHealthMessages',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  getHealthMessages(
    @Args('status', {
      type: () => HealthMessageStatusFilterEnum,
      nullable: true,
    })
    status: HealthMessageStatusFilterEnum | undefined,
    @Args('starred', { type: () => Boolean, nullable: true })
    starred: boolean | undefined,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthMessage[] | null> {
    return this.api.getHealthMessages(user, status, starred)
  }

  @Query(() => HealthDirectorateHealthMessageDetail, {
    name: 'healthDirectorateHealthMessage',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  getHealthMessage(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthMessageDetail | null> {
    return this.api.getHealthMessage(user, id)
  }

  @Query(() => [HealthDirectorateHealthMessagingRecipient], {
    name: 'healthDirectorateHealthMessagingRecipients',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  getHealthMessagingRecipients(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthMessagingRecipient[] | null> {
    return this.api.getHealthMessagingRecipients(user, locale)
  }

  @Mutation(() => HealthDirectorateHealthMessageDetail, {
    name: 'healthDirectorateCreateHealthMessage',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  createHealthMessage(
    @Args('input') input: HealthDirectorateCreateMessageInput,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthMessageDetail | null> {
    return this.api.createHealthMessage(user, input)
  }

  @Mutation(() => HealthDirectorateHealthMessageDetail, {
    name: 'healthDirectorateReplyToHealthMessage',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  replyToHealthMessage(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: HealthDirectorateReplyToMessageInput,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthMessageDetail | null> {
    return this.api.replyToHealthMessage(user, id, input)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateMarkHealthMessageAsRead',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  markHealthMessageAsRead(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.markHealthMessageAsRead(user, id)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateArchiveHealthMessage',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  archiveHealthMessage(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.archiveHealthMessage(user, id)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateUnarchiveHealthMessage',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  unarchiveHealthMessage(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.unarchiveHealthMessage(user, id)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateStarHealthMessage',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  starHealthMessage(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.starHealthMessage(user, id)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateUnstarHealthMessage',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  unstarHealthMessage(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.unstarHealthMessage(user, id)
  }
}
