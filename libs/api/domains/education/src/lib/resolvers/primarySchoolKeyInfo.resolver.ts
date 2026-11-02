import { UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

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

import { PrimarySchoolStudent } from '../models/primarySchool/primarySchoolStudent.model'
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
import { PrimarySchoolKeyInfoService } from '../services/primarySchoolKeyInfo.service'

/**
 * "Lykilupplýsingar" (key information) for a primary-school child: emergency
 * contacts, language profile and health profile. Backed by the MMS
 * nemendagrunnur form-api (contract v0.2, §4).
 *
 * They hang off {@link PrimarySchoolStudent} rather than sitting at the root,
 * so the hierarchy is explicit and each read gets the child's national id from
 * the parent instead of looking the student up again. A child with no
 * counterpart in frigg reads as "no information" (an empty list / null) so the
 * overview still renders; the mutations in
 * {@link PrimarySchoolKeyInfoMutationsResolver} fail instead.
 *
 * The lookup lists these sections pick from live in
 * {@link PrimarySchoolKeyInfoOptionsResolver} — they are per-user, not
 * per-student.
 */
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isServicePortalPrimarySchoolPageEnabled)
@Scopes(ApiScope.education)
@Resolver(() => PrimarySchoolStudent)
export class PrimarySchoolKeyInfoResolver {
  constructor(
    private readonly keyInfoClient: FriggKeyInfoClientService,
    private readonly keyInfo: PrimarySchoolKeyInfoService,
  ) {}

  @ResolveField(() => Boolean, {
    description:
      'Whether the student exists in the MMS key-information database, i.e. whether the key-information sections have anything to show.',
  })
  async hasKeyInfo(
    @CurrentUser() user: User,
    @Parent() student: PrimarySchoolStudent,
  ): Promise<boolean> {
    const childId = await this.keyInfo.findChildId(user, student.nationalId)
    return childId !== null
  }

  @ResolveField(() => [PrimarySchoolAgent], { nullable: true })
  async emergencyContacts(
    @CurrentUser() user: User,
    @Parent() student: PrimarySchoolStudent,
  ): Promise<PrimarySchoolAgent[]> {
    const childId = await this.keyInfo.findChildId(user, student.nationalId)
    if (!childId) return []
    const contacts = await this.keyInfoClient.getEmergencyContacts(
      user,
      childId,
    )
    return contacts.map(mapAgent)
  }

  @ResolveField(() => LanguageProfile, { nullable: true })
  async languageProfile(
    @CurrentUser() user: User,
    @Parent() student: PrimarySchoolStudent,
  ): Promise<LanguageProfile | null> {
    const childId = await this.keyInfo.findChildId(user, student.nationalId)
    if (!childId) return null
    const profile = await this.keyInfoClient.getLanguageProfile(user, childId)
    return mapLanguageProfile(profile)
  }

  @ResolveField(() => HealthProfile, { nullable: true })
  async healthProfile(
    @CurrentUser() user: User,
    @Parent() student: PrimarySchoolStudent,
  ): Promise<HealthProfile | null> {
    const childId = await this.keyInfo.findChildId(user, student.nationalId)
    if (!childId) return null
    const profile = await this.keyInfoClient.getHealthProfile(user, childId)
    return mapHealthProfile(profile)
  }
}
