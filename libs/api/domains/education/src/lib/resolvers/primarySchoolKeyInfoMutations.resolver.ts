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
import { PrimarySchoolKeyInfoService } from '../services/primarySchoolKeyInfo.service'
import { withMmsKeyInfoProblem } from '../errors/mmsKeyInfoProblem'

/**
 * Writes for the key-information sections (contract v0.2, §4). Every input
 * carries the routed nemendagrunnur `studentId`, which
 * {@link PrimarySchoolKeyInfoService.requireChildIdForStudent} translates into
 * the frigg child id — and rejects when the child does not exist there.
 *
 * The matching reads are field resolvers on the student, see
 * {@link PrimarySchoolKeyInfoResolver}.
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
  constructor(
    private readonly keyInfoClient: FriggKeyInfoClientService,
    private readonly keyInfo: PrimarySchoolKeyInfoService,
  ) {}

  /* -- Emergency contacts (agents) ----------------------------------------- */

  @Mutation(() => PrimarySchoolAgent)
  async primarySchoolAddAgent(
    @CurrentUser() user: User,
    @Args('input') input: AddAgentInput,
  ): Promise<PrimarySchoolAgent> {
    const childId = await this.keyInfo.requireChildIdForStudent(
      user,
      input.studentId,
    )
    const contact = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.addEmergencyContact(user, childId, {
        nationalId: input.nationalId,
        relationTypeId: input.relationTypeId,
      }),
    )
    return mapAgent(contact)
  }

  @Mutation(() => PrimarySchoolAgent)
  async primarySchoolUpdateAgent(
    @CurrentUser() user: User,
    @Args('input') input: UpdateAgentInput,
  ): Promise<PrimarySchoolAgent> {
    const childId = await this.keyInfo.requireChildIdForStudent(
      user,
      input.studentId,
    )
    const contact = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.updateEmergencyContact(user, childId, input.agentId, {
        relationTypeId: input.relationTypeId,
      }),
    )
    return mapAgent(contact)
  }

  @Mutation(() => Boolean)
  async primarySchoolDeleteAgent(
    @CurrentUser() user: User,
    @Args('input') input: DeleteAgentInput,
  ): Promise<boolean> {
    const childId = await this.keyInfo.requireChildIdForStudent(
      user,
      input.studentId,
    )
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
  ): Promise<LanguageProfile> {
    const childId = await this.keyInfo.requireChildIdForStudent(
      user,
      input.studentId,
    )
    const profile = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.updateLanguageProfile(user, childId, {
        languageEnvironmentId: input.languageEnvironmentId,
        preferredLanguage: input.preferredLanguage ?? null,
        languages: input.languages,
        interpreter: input.interpreter,
        signLanguage: input.signLanguage,
      }),
    )
    return mapLanguageProfile(profile)
  }

  /* -- Health profile ------------------------------------------------------ */

  @Mutation(() => HealthProfile)
  async primarySchoolUpdateHealthProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateHealthProfileInput,
  ): Promise<HealthProfile> {
    const childId = await this.keyInfo.requireChildIdForStudent(
      user,
      input.studentId,
    )
    const profile = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.updateHealthProfile(user, childId, {
        epipen: input.epipen,
        medicalDiagnoses: input.medicalDiagnoses,
        medicationAssistance: input.medicationAssistance,
        allergies: input.allergies,
      }),
    )
    return mapHealthProfile(profile)
  }
}
