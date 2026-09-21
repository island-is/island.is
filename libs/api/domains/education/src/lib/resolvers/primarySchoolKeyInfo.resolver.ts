import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

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
import { PrimarySchoolKeyInfoClientService } from '@island.is/clients/mms/primary-school'

import { PrimarySchoolAgent } from '../models/primarySchool/keyInfo/agent.model'
import {
  Allergy,
  LanguageEnvironment,
  RelationType,
} from '../models/primarySchool/keyInfo/lookups.model'
import {
  HealthProfile,
  LanguageProfile,
} from '../models/primarySchool/keyInfo/profiles.model'
import {
  mapAgent,
  mapAllergy,
  mapHealthProfile,
  mapLanguageEnvironment,
  mapLanguageProfile,
  mapRelationType,
} from '../models/primarySchool/keyInfo/keyInfo.mapper'
import {
  AddAgentInput,
  DeleteAgentInput,
  UpdateAgentInput,
  UpdateHealthProfileInput,
  UpdateLanguageProfileInput,
} from '../dto/primarySchoolKeyInfo.input'

/**
 * "Lykilupplýsingar" (key information) for a primary-school child: emergency
 * contacts, language profile and health profile, plus their lookup lists.
 * Backed by the MMS nemendagrunnur form-api (contract v0.2, §4).
 *
 * The client service currently returns mocked contract payloads — this resolver
 * and its mappers are the real thing, so connecting the X-Road client is the
 * only remaining step.
 */
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isServicePortalPrimarySchoolPageEnabled)
@Scopes(ApiScope.education)
@Resolver()
export class PrimarySchoolKeyInfoResolver {
  constructor(
    private readonly keyInfoService: PrimarySchoolKeyInfoClientService,
  ) {}

  /* -- Lookup lists -------------------------------------------------------- */

  @Query(() => [RelationType], { nullable: true })
  async primarySchoolAgentRelationTypes(
    @CurrentUser() user: User,
  ): Promise<RelationType[]> {
    const types = await this.keyInfoService.getAgentRelationTypes(user)
    return types.map(mapRelationType)
  }

  @Query(() => [Allergy], { nullable: true })
  async primarySchoolAllergies(
    @CurrentUser() user: User,
  ): Promise<Allergy[]> {
    const allergies = await this.keyInfoService.getAllergies(user)
    return allergies.map(mapAllergy)
  }

  @Query(() => [LanguageEnvironment], { nullable: true })
  async primarySchoolLanguageEnvironments(
    @CurrentUser() user: User,
  ): Promise<LanguageEnvironment[]> {
    const environments = await this.keyInfoService.getLanguageEnvironments(user)
    return environments.map(mapLanguageEnvironment)
  }

  /* -- Emergency contacts (agents) ----------------------------------------- */

  @Query(() => [PrimarySchoolAgent], { nullable: true })
  async primarySchoolAgents(
    @CurrentUser() user: User,
    @Args('childId') childId: string,
  ): Promise<PrimarySchoolAgent[]> {
    const agents = await this.keyInfoService.getChildAgents(user, childId)
    return agents.map(mapAgent)
  }

  @Mutation(() => PrimarySchoolAgent)
  async primarySchoolAddAgent(
    @CurrentUser() user: User,
    @Args('input') input: AddAgentInput,
  ): Promise<PrimarySchoolAgent> {
    const agent = await this.keyInfoService.addChildAgent(user, input.childId, {
      nationalId: input.nationalId,
      relationTypeId: input.relationTypeId,
    })
    return mapAgent(agent)
  }

  @Mutation(() => PrimarySchoolAgent)
  async primarySchoolUpdateAgent(
    @CurrentUser() user: User,
    @Args('input') input: UpdateAgentInput,
  ): Promise<PrimarySchoolAgent> {
    const agent = await this.keyInfoService.updateChildAgent(
      user,
      input.childId,
      input.agentId,
      { relationTypeId: input.relationTypeId },
    )
    return mapAgent(agent)
  }

  @Mutation(() => Boolean)
  async primarySchoolDeleteAgent(
    @CurrentUser() user: User,
    @Args('input') input: DeleteAgentInput,
  ): Promise<boolean> {
    return this.keyInfoService.deleteChildAgent(
      user,
      input.childId,
      input.agentId,
    )
  }

  /* -- Language profile ---------------------------------------------------- */

  @Query(() => LanguageProfile, { nullable: true })
  async primarySchoolLanguageProfile(
    @CurrentUser() user: User,
    @Args('childId') childId: string,
  ): Promise<LanguageProfile> {
    const profile = await this.keyInfoService.getChildLanguageProfile(
      user,
      childId,
    )
    return mapLanguageProfile(profile)
  }

  @Mutation(() => LanguageProfile)
  async primarySchoolUpdateLanguageProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateLanguageProfileInput,
  ): Promise<LanguageProfile> {
    const profile = await this.keyInfoService.updateChildLanguageProfile(
      user,
      input.childId,
      {
        languageEnvironmentId: input.languageEnvironmentId ?? null,
        preferredLanguage: input.preferredLanguage ?? null,
        languages: input.languages,
        interpreter: input.interpreter,
        signLanguage: input.signLanguage,
      },
    )
    return mapLanguageProfile(profile)
  }

  /* -- Health profile ------------------------------------------------------ */

  @Query(() => HealthProfile, { nullable: true })
  async primarySchoolHealthProfile(
    @CurrentUser() user: User,
    @Args('childId') childId: string,
  ): Promise<HealthProfile> {
    const profile = await this.keyInfoService.getChildHealthProfile(
      user,
      childId,
    )
    return mapHealthProfile(profile, this.keyInfoService.healthEditEnabled())
  }

  @Mutation(() => HealthProfile)
  async primarySchoolUpdateHealthProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateHealthProfileInput,
  ): Promise<HealthProfile> {
    const profile = await this.keyInfoService.updateChildHealthProfile(
      user,
      input.childId,
      {
        epipen: input.epipen,
        medicalDiagnoses: input.medicalDiagnoses,
        medicationAssistance: input.medicationAssistance,
        allergies: input.allergies,
      },
    )
    return mapHealthProfile(profile, this.keyInfoService.healthEditEnabled())
  }
}
