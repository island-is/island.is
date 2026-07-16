import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import type {
  LogoUrl,
  OrganizationLogoByNationalIdDataLoader,
} from '@island.is/cms'
import { OrganizationLogoByNationalIdLoader } from '@island.is/cms'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Audit } from '@island.is/nest/audit'
import { Loader } from '@island.is/nest/dataloader'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { LocaleEnum } from '@island.is/nest/graphql'

import { HealthDirectorateService } from '../health-directorate.service'
import { HealthDirectorateCreateConversationInput } from '../dto/createHealthConversation.input'
import { HealthDirectorateConversationIdInput } from '../dto/healthConversationId.input'
import { HealthDirectorateHealthConversationsFilterInput } from '../dto/healthConversationsFilter.input'
import { HealthDirectorateReplyToConversationInput } from '../dto/replyToHealthConversation.input'
import { HealthDirectorateHealthConversation } from '../models/healthConversation.model'
import { HealthDirectorateHealthConversationDetail } from '../models/healthConversationDetail.model'
import { HealthDirectorateHealthConversationRecipient } from '../models/healthConversationRecipient.model'

const loadOrganizationLogoUrl = (
  loader: OrganizationLogoByNationalIdDataLoader,
  conversation: Pick<
    HealthDirectorateHealthConversation,
    'organizationNationalId'
  >,
): Promise<LogoUrl | undefined> | undefined =>
  conversation.organizationNationalId
    ? loader.load(conversation.organizationNationalId)
    : undefined

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
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  getHealthConversations(
    @Args('input', {
      type: () => HealthDirectorateHealthConversationsFilterInput,
      nullable: true,
    })
    input: HealthDirectorateHealthConversationsFilterInput | undefined,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthConversation[] | null> {
    return this.api.getHealthConversations(user, input?.status, input?.starred)
  }

  @Query(() => HealthDirectorateHealthConversationDetail, {
    name: 'healthDirectorateHealthConversation',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  getHealthConversation(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthConversationDetail | null> {
    return this.api.getHealthConversation(user, id)
  }

  @Query(() => [HealthDirectorateHealthConversationRecipient], {
    name: 'healthDirectorateHealthConversationRecipients',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  getHealthConversationRecipients(
    @Args('locale', { type: () => LocaleEnum, nullable: true })
    locale: LocaleEnum = LocaleEnum.Is,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthConversationRecipient[] | null> {
    return this.api.getHealthConversationRecipients(user, locale)
  }

  @ResolveField('organizationLogoUrl', () => String, { nullable: true })
  resolveOrganizationLogoUrl(
    @Loader(OrganizationLogoByNationalIdLoader)
    organizationLogoLoader: OrganizationLogoByNationalIdDataLoader,
    @Parent() conversation: HealthDirectorateHealthConversation,
  ): Promise<LogoUrl | undefined> | undefined {
    return loadOrganizationLogoUrl(organizationLogoLoader, conversation)
  }

  @Mutation(() => HealthDirectorateHealthConversationDetail, {
    name: 'healthDirectorateCreateHealthConversation',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.health)
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
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  replyToHealthConversation(
    @Args('input') input: HealthDirectorateReplyToConversationInput,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateHealthConversationDetail | null> {
    return this.api.replyToHealthConversation(user, input.id, input)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateMarkHealthConversationAsRead',
  })
  @Audit()
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  markHealthConversationAsRead(
    @Args('input') input: HealthDirectorateConversationIdInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.markHealthConversationAsRead(user, input.id)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateArchiveHealthConversation',
  })
  @Audit()
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  archiveHealthConversation(
    @Args('input') input: HealthDirectorateConversationIdInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.archiveHealthConversation(user, input.id)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateUnarchiveHealthConversation',
  })
  @Audit()
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  unarchiveHealthConversation(
    @Args('input') input: HealthDirectorateConversationIdInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.unarchiveHealthConversation(user, input.id)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateStarHealthConversation',
  })
  @Audit()
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  starHealthConversation(
    @Args('input') input: HealthDirectorateConversationIdInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.starHealthConversation(user, input.id)
  }

  @Mutation(() => Boolean, {
    name: 'healthDirectorateUnstarHealthConversation',
  })
  @Audit()
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  unstarHealthConversation(
    @Args('input') input: HealthDirectorateConversationIdInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.api.unstarHealthConversation(user, input.id)
  }
}

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver(() => HealthDirectorateHealthConversationDetail)
export class HealthConversationDetailResolver {
  @ResolveField('organizationLogoUrl', () => String, { nullable: true })
  resolveOrganizationLogoUrl(
    @Loader(OrganizationLogoByNationalIdLoader)
    organizationLogoLoader: OrganizationLogoByNationalIdDataLoader,
    @Parent() conversation: HealthDirectorateHealthConversationDetail,
  ): Promise<LogoUrl | undefined> | undefined {
    return loadOrganizationLogoUrl(organizationLogoLoader, conversation)
  }
}
