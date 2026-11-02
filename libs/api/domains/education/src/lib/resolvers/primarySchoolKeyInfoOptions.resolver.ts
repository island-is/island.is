import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

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
import { FriggKeyInfoClientService } from '@island.is/clients/mms/frigg'

import {
  Allergy,
  LanguageEnvironment,
  RelationType,
} from '../models/primarySchool/keyInfo/lookups.model'
import {
  mapAllergyOption,
  mapLanguageEnvironment,
  mapRelationType,
} from '../models/primarySchool/keyInfo/keyInfo.mapper'

/**
 * The lookup lists the key-information sections pick from (frigg
 * `/key-options`). They are reference data, the same for every child, so they
 * stay at the root rather than hanging off a student.
 */
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isServicePortalPrimarySchoolPageEnabled)
@Scopes(ApiScope.education)
@Resolver()
export class PrimarySchoolKeyInfoOptionsResolver {
  constructor(private readonly keyInfoClient: FriggKeyInfoClientService) {}

  @Query(() => [RelationType], { nullable: true })
  async primarySchoolAgentRelationTypes(
    @CurrentUser() user: User,
  ): Promise<RelationType[]> {
    const options = await this.keyInfoClient.getRelationTypeOptions(user)
    return options.map(mapRelationType)
  }

  @Query(() => [Allergy], { nullable: true })
  async primarySchoolAllergies(@CurrentUser() user: User): Promise<Allergy[]> {
    const options = await this.keyInfoClient.getAllergyOptions(user)
    return options.map(mapAllergyOption)
  }

  @Query(() => [LanguageEnvironment], { nullable: true })
  async primarySchoolLanguageEnvironments(
    @CurrentUser() user: User,
  ): Promise<LanguageEnvironment[]> {
    const options = await this.keyInfoClient.getLanguageEnvironmentOptions(user)
    return options.map(mapLanguageEnvironment)
  }
}
