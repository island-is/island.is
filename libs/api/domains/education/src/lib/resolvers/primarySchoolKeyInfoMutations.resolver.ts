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

/**
 * Writes for the key-information sections (contract v0.2, §4). Every input
 * carries the routed nemendagrunnur `studentId`, which
 * {@link PrimarySchoolKeyInfoService.requireChildIdForStudent} translates into
 * the frigg child id — and rejects when the child does not exist there.
 *
 * The matching reads are field resolvers on the student, see
 * {@link PrimarySchoolKeyInfoResolver}.
 */
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isServicePortalPrimarySchoolPageEnabled)
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
    const contact = await this.keyInfoClient.addEmergencyContact(
      user,
      await this.keyInfo.requireChildIdForStudent(user, input.studentId),
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
    const contact = await this.keyInfoClient.updateEmergencyContact(
      user,
      await this.keyInfo.requireChildIdForStudent(user, input.studentId),
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
    await this.keyInfoClient.deleteEmergencyContact(
      user,
      await this.keyInfo.requireChildIdForStudent(user, input.studentId),
      input.agentId,
    )
    return true
  }

  /* -- Language profile ---------------------------------------------------- */

  @Mutation(() => LanguageProfile)
  async primarySchoolUpdateLanguageProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateLanguageProfileInput,
  ): Promise<LanguageProfile> {
    const profile = await this.keyInfoClient.updateLanguageProfile(
      user,
      await this.keyInfo.requireChildIdForStudent(user, input.studentId),
      {
        languageEnvironmentId: input.languageEnvironmentId,
        preferredLanguage: input.preferredLanguage ?? null,
        languages: input.languages,
        interpreter: input.interpreter,
        signLanguage: input.signLanguage,
      },
    )
    return mapLanguageProfile(profile)
  }

  /* -- Health profile ------------------------------------------------------ */

  @Mutation(() => HealthProfile)
  async primarySchoolUpdateHealthProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateHealthProfileInput,
  ): Promise<HealthProfile> {
    const profile = await this.keyInfoClient.updateHealthProfile(
      user,
      await this.keyInfo.requireChildIdForStudent(user, input.studentId),
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
