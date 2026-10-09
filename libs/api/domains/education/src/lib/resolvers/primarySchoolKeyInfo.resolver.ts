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
import { FriggKeyInfoClientService } from '@island.is/clients/mms/frigg'

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
  mapAllergyOption,
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
    private readonly keyInfoService: FriggKeyInfoClientService,
  ) {}

  /* -- Lookup lists -------------------------------------------------------- */

  @Query(() => [RelationType], { nullable: true })
  async primarySchoolAgentRelationTypes(
    @CurrentUser() user: User,
  ): Promise<RelationType[]> {
    const options = await this.keyInfoService.getRelationTypeOptions(user)
    return options.map(mapRelationType)
  }

  @Query(() => [Allergy], { nullable: true })
  async primarySchoolAllergies(@CurrentUser() user: User): Promise<Allergy[]> {
    const options = await this.keyInfoService.getAllergyOptions(user)
    return options.map(mapAllergyOption)
  }

  @Query(() => [LanguageEnvironment], { nullable: true })
  async primarySchoolLanguageEnvironments(
    @CurrentUser() user: User,
  ): Promise<LanguageEnvironment[]> {
    const options = await this.keyInfoService.getLanguageEnvironmentOptions(user)
    return options.map(mapLanguageEnvironment)
  }

  /* -- Emergency contacts (agents) ----------------------------------------- */

  @Query(() => [PrimarySchoolAgent], { nullable: true })
  async primarySchoolAgents(
    @CurrentUser() user: User,
    @Args('childId') childId: string,
  ): Promise<PrimarySchoolAgent[]> {
    const contacts = await this.keyInfoService.getEmergencyContacts(
      user,
      childId,
    )
    return contacts.map(mapAgent)
  }

  @Mutation(() => PrimarySchoolAgent)
  async primarySchoolAddAgent(
    @CurrentUser() user: User,
    @Args('input') input: AddAgentInput,
  ): Promise<PrimarySchoolAgent> {
    const contact = await this.keyInfoService.addEmergencyContact(
      user,
      input.childId,
      {
        nationalId: input.nationalId,
        relationTypeId: input.relationTypeId,
      },
    )
    return mapAgent(contact)
  }

  @Mutation(() => PrimarySchoolAgent)
  async primarySchoolUpdateAgent(
    @CurrentUser() user: User,
    @Args('input') input: UpdateAgentInput,
  ): Promise<PrimarySchoolAgent> {
    const contact = await this.keyInfoService.updateEmergencyContact(
      user,
      input.childId,
      input.agentId,
      { relationTypeId: input.relationTypeId },
    )
    return mapAgent(contact)
  }

  @Mutation(() => Boolean)
  async primarySchoolDeleteAgent(
    @CurrentUser() user: User,
    @Args('input') input: DeleteAgentInput,
  ): Promise<boolean> {
    await this.keyInfoService.deleteEmergencyContact(
      user,
      input.childId,
      input.agentId,
    )
    return true
  }

  /* -- Language profile ---------------------------------------------------- */

  @Query(() => LanguageProfile, { nullable: true })
  async primarySchoolLanguageProfile(
    @CurrentUser() user: User,
    @Args('childId') childId: string,
  ): Promise<LanguageProfile> {
    const profile = await this.keyInfoService.getLanguageProfile(user, childId)
    return mapLanguageProfile(profile)
  }

  @Mutation(() => LanguageProfile)
  async primarySchoolUpdateLanguageProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateLanguageProfileInput,
  ): Promise<LanguageProfile> {
    const profile = await this.keyInfoService.updateLanguageProfile(
      user,
      input.childId,
      {
        // MMS requires an id here; the UI select enforces a choice.
        languageEnvironmentId: input.languageEnvironmentId ?? '',
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
    const profile = await this.keyInfoService.getHealthProfile(user, childId)
    return mapHealthProfile(profile)
  }

  @Mutation(() => HealthProfile)
  async primarySchoolUpdateHealthProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateHealthProfileInput,
  ): Promise<HealthProfile> {
    const profile = await this.keyInfoService.updateHealthProfile(
      user,
      input.childId,
      {
        epipen: input.epipen,
        medicalDiagnoses: input.medicalDiagnoses,
        medicationAssistance: input.medicationAssistance,
        allergies: input.allergies,
      },
    )
    return mapHealthProfile(profile)
  }
}
