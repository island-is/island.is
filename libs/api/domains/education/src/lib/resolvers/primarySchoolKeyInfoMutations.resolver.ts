import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

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

import { PrimarySchoolAgent } from '../models/primarySchool/keyInfo/agent.model'
import {
  HealthProfile,
  LanguageProfile,
} from '../models/primarySchool/keyInfo/profiles.model'
import {
  mapAgent,
  mapHealthProfile,
  mapLanguageProfile,
} from '../models/primarySchool/keyInfo/keyInfo.mapper'
import {
  AddAgentInput,
  DeleteAgentInput,
  UpdateAgentInput,
  UpdateHealthProfileInput,
  UpdateLanguageProfileInput,
} from '../dto/primarySchoolKeyInfo.input'
import { withMmsKeyInfoProblem } from '../errors/mmsKeyInfoProblem'

/**
 * Writes for the key-information sections (contract v0.3, §4). Every input
 * carries the routed nemendagrunnur `studentId`, which is also the frigg child
 * id (`base.users.id` — contract v0.3 §4.3), so it is passed straight through.
 *
 * Nothing is looked up first to check the child exists or belongs to the
 * caller: frigg verifies guardianship and active enrolment on every call and
 * answers 404 `NOT_FOUND` otherwise (§3, §6). Checking it here too would cost
 * two extra round trips to reach the same answer by guessing at frigg's rule.
 *
 * The matching reads are field resolvers on the student, see
 * {@link PrimarySchoolKeyInfoResolver}; each mutation returns the record it
 * wrote, so it takes the same `locale` they do.
 *
 * Every frigg call goes through {@link withMmsKeyInfoProblem} so a rejection
 * reaches the client as its MMS code rather than an unclassified 500 — the
 * add/edit screens show a specific message per code.
 *
 * Gated on the key-information feature flag, like the matching reads.
 */
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isServicePortalPrimarySchoolKeyInfoEnabled)
@Scopes(ApiScope.education)
@Resolver()
export class PrimarySchoolKeyInfoMutationsResolver {
  constructor(private readonly keyInfoClient: FriggKeyInfoClientService) {}

  /* -- Emergency contacts (agents) ----------------------------------------- */

  @Mutation(() => PrimarySchoolAgent)
  async primarySchoolAddAgent(
    @CurrentUser() user: User,
    @Args('input') input: AddAgentInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<PrimarySchoolAgent> {
    const childId = input.studentId
    const contact = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.addEmergencyContact(user, childId, {
        nationalId: input.nationalId,
        relationTypeId: input.relationTypeId,
      }),
    )
    return mapAgent(contact, locale)
  }

  @Mutation(() => PrimarySchoolAgent)
  async primarySchoolUpdateAgent(
    @CurrentUser() user: User,
    @Args('input') input: UpdateAgentInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<PrimarySchoolAgent> {
    const childId = input.studentId
    const contact = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.updateEmergencyContact(user, childId, input.agentId, {
        relationTypeId: input.relationTypeId,
      }),
    )
    return mapAgent(contact, locale)
  }

  @Mutation(() => Boolean)
  async primarySchoolDeleteAgent(
    @CurrentUser() user: User,
    @Args('input') input: DeleteAgentInput,
  ): Promise<boolean> {
    const childId = input.studentId
    await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.deleteEmergencyContact(user, childId, input.agentId),
    )
    return true
  }

  /* -- Language profile ---------------------------------------------------- */

  @Mutation(() => LanguageProfile)
  async primarySchoolUpdateLanguageProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateLanguageProfileInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<LanguageProfile> {
    const childId = input.studentId
    const profile = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.updateLanguageProfile(user, childId, {
        languageEnvironmentId: input.languageEnvironmentId,
        preferredLanguage: input.preferredLanguage ?? null,
        languages: input.languages,
        interpreter: input.interpreter,
        signLanguage: input.signLanguage,
      }),
    )
    return mapLanguageProfile(profile, locale)
  }

  /* -- Health profile ------------------------------------------------------ */

  @Mutation(() => HealthProfile)
  async primarySchoolUpdateHealthProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateHealthProfileInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<HealthProfile> {
    const childId = input.studentId
    const profile = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.updateHealthProfile(user, childId, {
        epipen: input.epipen,
        medicalDiagnoses: input.medicalDiagnoses,
        medicationAssistance: input.medicationAssistance,
        allergies: input.allergies,
      }),
    )
    return mapHealthProfile(profile, locale)
  }
}
