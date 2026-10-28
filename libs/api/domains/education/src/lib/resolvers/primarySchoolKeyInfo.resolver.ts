import { NotFoundException, UseGuards } from '@nestjs/common'
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
import { PrimarySchoolClientService } from '@island.is/clients/mms/primary-school'

import { PrimarySchoolAgent } from '../models/primarySchool/keyInfo/agent.model'
import { PrimarySchoolChild } from '../models/primarySchool/keyInfo/child.model'
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
  mapChild,
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
    private readonly primarySchoolService: PrimarySchoolClientService,
  ) {}

  /**
   * The frontend routes on the nemendagrunnur student id (the id behind the
   * student list, overview and assessments). Frigg, which backs key info, keys
   * children on a different id (base.users.id from the data gateway), so the
   * routed id is never found there. The only field both backends share is the
   * national id, so we translate: routed student id -> national id (via the
   * nemendagrunnur student list) -> frigg child id.
   *
   * Returns null when the child has no counterpart in frigg (e.g. not yet
   * registered in MMS). Read queries treat that as "no information" and fall
   * back to an empty result so the overview still renders; mutations use
   * {@link requireFriggChildId} and fail instead.
   */
  private async resolveFriggChildId(
    user: User,
    studentId: string,
  ): Promise<string | null> {
    const students = await this.primarySchoolService.getStudents(user)
    const nationalId = students?.find((s) => s.id === studentId)?.nationalId
    const children = await this.keyInfoService.getChildren(user)
    return (
      (nationalId && children.find((c) => c.nationalId === nationalId)?.id) ||
      null
    )
  }

  /** As {@link resolveFriggChildId}, but throws when the child is missing — for
   * mutations, which cannot act on a child that does not exist in frigg. */
  private async requireFriggChildId(
    user: User,
    studentId: string,
  ): Promise<string> {
    const childId = await this.resolveFriggChildId(user, studentId)
    if (!childId) {
      throw new NotFoundException(
        `No key-information child found for student ${studentId}`,
      )
    }
    return childId
  }

  /* -- Children ------------------------------------------------------------ */

  @Query(() => [PrimarySchoolChild], { nullable: true })
  async primarySchoolChildren(
    @CurrentUser() user: User,
  ): Promise<PrimarySchoolChild[]> {
    const children = await this.keyInfoService.getChildren(user)
    return children.map(mapChild)
  }

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
    const options = await this.keyInfoService.getLanguageEnvironmentOptions(
      user,
    )
    return options.map(mapLanguageEnvironment)
  }

  /* -- Emergency contacts (agents) ----------------------------------------- */

  @Query(() => [PrimarySchoolAgent], { nullable: true })
  async primarySchoolAgents(
    @CurrentUser() user: User,
    @Args('childId') childId: string,
  ): Promise<PrimarySchoolAgent[]> {
    const friggChildId = await this.resolveFriggChildId(user, childId)
    if (!friggChildId) return []
    const contacts = await this.keyInfoService.getEmergencyContacts(
      user,
      friggChildId,
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
      await this.requireFriggChildId(user, input.childId),
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
      await this.requireFriggChildId(user, input.childId),
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
      await this.requireFriggChildId(user, input.childId),
      input.agentId,
    )
    return true
  }

  /* -- Language profile ---------------------------------------------------- */

  @Query(() => LanguageProfile, { nullable: true })
  async primarySchoolLanguageProfile(
    @CurrentUser() user: User,
    @Args('childId') childId: string,
  ): Promise<LanguageProfile | null> {
    const friggChildId = await this.resolveFriggChildId(user, childId)
    if (!friggChildId) return null
    const profile = await this.keyInfoService.getLanguageProfile(
      user,
      friggChildId,
    )
    return mapLanguageProfile(profile)
  }

  @Mutation(() => LanguageProfile)
  async primarySchoolUpdateLanguageProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateLanguageProfileInput,
  ): Promise<LanguageProfile> {
    const profile = await this.keyInfoService.updateLanguageProfile(
      user,
      await this.requireFriggChildId(user, input.childId),
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
  ): Promise<HealthProfile | null> {
    const friggChildId = await this.resolveFriggChildId(user, childId)
    if (!friggChildId) return null
    const profile = await this.keyInfoService.getHealthProfile(
      user,
      friggChildId,
    )
    return mapHealthProfile(profile)
  }

  @Mutation(() => HealthProfile)
  async primarySchoolUpdateHealthProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateHealthProfileInput,
  ): Promise<HealthProfile> {
    const profile = await this.keyInfoService.updateHealthProfile(
      user,
      await this.requireFriggChildId(user, input.childId),
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
