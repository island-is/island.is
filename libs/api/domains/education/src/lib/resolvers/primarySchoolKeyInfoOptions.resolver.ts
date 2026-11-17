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
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { LocaleEnum } from '@island.is/nest/graphql'
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
import { withMmsKeyInfoProblem } from '../errors/mmsKeyInfoProblem'

/**
 * The lookup lists the key-information sections pick from (frigg
 * `/key-options`). Reference data, the same for every child, with titles
 * resolved to the requested locale and sorted by them — except the language
 * environments, where frigg's own order is the scale they read as.
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
    @Args('locale', { type: () => LocaleEnum, nullable: true })
    locale: LocaleEnum = LocaleEnum.Is,
  ): Promise<RelationType[]> {
    const options = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.getRelationTypeOptions(user),
    )
    return options
      .map((option) => mapRelationType(option, locale))
      .sort(byTitle(locale))
  }

  @Query(() => [Allergy], { nullable: true })
  async primarySchoolAllergies(
    @CurrentUser() user: User,
    @Args('locale', { type: () => LocaleEnum, nullable: true })
    locale: LocaleEnum = LocaleEnum.Is,
  ): Promise<Allergy[]> {
    const options = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.getAllergyOptions(user),
    )
    return options
      .map((option) => mapAllergyOption(option, locale))
      .sort(byTitle(locale))
  }

  @Query(() => [LanguageEnvironment], { nullable: true })
  async primarySchoolLanguageEnvironments(
    @CurrentUser() user: User,
    @Args('locale', { type: () => LocaleEnum, nullable: true })
    locale: LocaleEnum = LocaleEnum.Is,
  ): Promise<LanguageEnvironment[]> {
    const options = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.getLanguageEnvironmentOptions(user),
    )
    return options.map((option) => mapLanguageEnvironment(option, locale))
  }
}
