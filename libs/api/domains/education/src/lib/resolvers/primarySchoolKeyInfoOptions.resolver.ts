import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import type { Locale } from '@island.is/shared/types'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { FriggKeyInfoClientService } from '@island.is/clients/mms/frigg'

import {
  Allergy,
  LanguageEnvironment,
  RelationType,
} from '../models/primarySchool/keyInfo/lookups.model'
import {
  byTitle,
  mapAllergyOption,
  mapLanguageEnvironment,
  mapRelationType,
} from '../models/primarySchool/keyInfo/keyInfo.mapper'

/**
 * The lookup lists the key-information sections pick from (frigg
 * `/key-options`). They are reference data, the same for every child, so they
 * stay at the root rather than hanging off a student.
 *
 * Each list comes back with its titles resolved to the requested `locale` and
 * sorted by them, except where frigg's own order carries meaning.
 *
 * Gated on the key-information feature flag, like the sections that use them.
 */
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isServicePortalPrimarySchoolKeyInfoEnabled)
@Scopes(ApiScope.education)
@Resolver()
export class PrimarySchoolKeyInfoOptionsResolver {
  constructor(private readonly keyInfoClient: FriggKeyInfoClientService) {}

  @Query(() => [RelationType], { nullable: true })
  async primarySchoolAgentRelationTypes(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<RelationType[]> {
    const options = await this.keyInfoClient.getRelationTypeOptions(user)
    return options
      .map((option) => mapRelationType(option, locale))
      .sort(byTitle(locale))
  }

  @Query(() => [Allergy], { nullable: true })
  async primarySchoolAllergies(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<Allergy[]> {
    const options = await this.keyInfoClient.getAllergyOptions(user)
    return options
      .map((option) => mapAllergyOption(option, locale))
      .sort(byTitle(locale))
  }

  /** Frigg's own order is the scale these read as, so it is kept. */
  @Query(() => [LanguageEnvironment], { nullable: true })
  async primarySchoolLanguageEnvironments(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<LanguageEnvironment[]> {
    const options = await this.keyInfoClient.getLanguageEnvironmentOptions(user)
    return options.map((option) => mapLanguageEnvironment(option, locale))
  }
}
