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
import { Loader } from '@island.is/nest/dataloader'
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
import { PrimarySchoolChildIdLoader } from '../loaders/primarySchoolChildId.loader'
import type { PrimarySchoolChildIdDataLoader } from '../loaders/primarySchoolChildId.loader'
import { withMmsKeyInfoProblem } from '../errors/mmsKeyInfoProblem'

/**
 * "Lykilupplýsingar" (key information) for a primary-school child: emergency
 * contacts, language profile and health profile. Backed by the MMS frigg
 * form-api (contract v0.2, §4).
 *
 * They hang off {@link PrimarySchoolStudent} rather than sitting at the root,
 * so the hierarchy is explicit and each read gets the child's national id from
 * the parent instead of looking the student up again. A child with no
 * counterpart in frigg reads as "no information" (an empty list / null) so the
 * overview still renders; the mutations in
 * {@link PrimarySchoolKeyInfoMutationsResolver} fail instead.
 *
 * Every field here needs the frigg child id behind the student, so it is
 * resolved through {@link PrimarySchoolChildIdLoader} — one `listChildren` call
 * per request rather than one per field.
 *
 * The lookup lists these sections pick from live in
 * {@link PrimarySchoolKeyInfoOptionsResolver} — they are per-user, not
 * per-student.
 *
 * Key information has its own feature flag, separate from the one gating the
 * rest of the primary-school page, so it can stay dark after the assessment
 * screens go live. The portal skips these reads entirely while it is off.
 */
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isServicePortalPrimarySchoolKeyInfoEnabled)
@Scopes(ApiScope.education)
@Resolver(() => PrimarySchoolStudent)
export class PrimarySchoolKeyInfoResolver {
  constructor(private readonly keyInfoClient: FriggKeyInfoClientService) {}

  @ResolveField(() => Boolean, {
    description:
      'Whether the student exists in the MMS key-information database, i.e. whether the key-information sections have anything to show.',
  })
  async hasKeyInfo(
    @Parent() student: PrimarySchoolStudent,
    @Loader(PrimarySchoolChildIdLoader)
    childIdLoader: PrimarySchoolChildIdDataLoader,
  ): Promise<boolean> {
    const childId = await this.childId(student, childIdLoader)
    return childId !== null
  }

  @ResolveField(() => [PrimarySchoolAgent], { nullable: true })
  async emergencyContacts(
    @CurrentUser() user: User,
    @Parent() student: PrimarySchoolStudent,
    @Loader(PrimarySchoolChildIdLoader)
    childIdLoader: PrimarySchoolChildIdDataLoader,
  ): Promise<PrimarySchoolAgent[]> {
    const childId = await this.childId(student, childIdLoader)
    if (!childId) return []
    const contacts = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.getEmergencyContacts(user, childId),
    )
    return contacts.map(mapAgent)
  }

  @ResolveField(() => LanguageProfile, { nullable: true })
  async languageProfile(
    @CurrentUser() user: User,
    @Parent() student: PrimarySchoolStudent,
    @Loader(PrimarySchoolChildIdLoader)
    childIdLoader: PrimarySchoolChildIdDataLoader,
  ): Promise<LanguageProfile | null> {
    const childId = await this.childId(student, childIdLoader)
    if (!childId) return null
    const profile = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.getLanguageProfile(user, childId),
    )
    return mapLanguageProfile(profile)
  }

  @ResolveField(() => HealthProfile, { nullable: true })
  async healthProfile(
    @CurrentUser() user: User,
    @Parent() student: PrimarySchoolStudent,
    @Loader(PrimarySchoolChildIdLoader)
    childIdLoader: PrimarySchoolChildIdDataLoader,
  ): Promise<HealthProfile | null> {
    const childId = await this.childId(student, childIdLoader)
    if (!childId) return null
    const profile = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.getHealthProfile(user, childId),
    )
    return mapHealthProfile(profile)
  }

  /** The frigg child id behind a student, or null when it has no counterpart
   * there. Students carry no national id for an unknown child, which frigg can
   * never match either. */
  private childId(
    student: PrimarySchoolStudent,
    childIdLoader: PrimarySchoolChildIdDataLoader,
  ): Promise<string | null> {
    return student.nationalId
      ? childIdLoader.load(student.nationalId)
      : Promise.resolve(null)
  }
}
