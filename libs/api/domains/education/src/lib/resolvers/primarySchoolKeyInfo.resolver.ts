import { UseGuards } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

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
 * so the hierarchy is explicit and each read takes the child from its parent
 * instead of looking the student up again. Frigg keys children on the same id
 * these screens route on (contract v0.3 §4.3), so nothing is translated — but
 * every field still has to know whether frigg has the child at all, which
 * {@link PrimarySchoolChildIdLoader} answers from one `listChildren` call per
 * request. A child frigg does not have reads as "no information" (an empty
 * list / null) so the overview still renders; the mutations in
 * {@link PrimarySchoolKeyInfoMutationsResolver} fail instead.
 *
 * Frigg serves titles as per-language key-option translations, so each field
 * takes a `locale` and resolves them here. The lookup lists these sections pick
 * from are per-user rather than per-student and live in
 * {@link PrimarySchoolKeyInfoOptionsResolver}.
 *
 * Key information has its own feature flag, separate from the one gating the
 * rest of the primary-school page, so it can stay dark after the assessment
 * screens go live.
 */
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isServicePortalPrimarySchoolKeyInfoEnabled)
@Scopes(ApiScope.education)
@Resolver(() => PrimarySchoolStudent)
export class PrimarySchoolKeyInfoResolver {
  constructor(private readonly keyInfoClient: FriggKeyInfoClientService) {}

  /** Nullable on purpose: this is the one key-info field every other one
   * depends on, and a non-nullable field that throws takes the whole
   * `primarySchoolStudent` down with it — which, with errorPolicy 'all' on the
   * portal side, is written into the Apollo cache as a null root field and
   * blanks the base info and the assessment tab too. Null here means "the
   * lookup failed", told apart from `false` ("frigg does not have this child")
   * by the error GraphQL reports on this field. */
  @ResolveField(() => Boolean, {
    nullable: true,
    description:
      'Whether the student exists in the MMS key-information database, i.e. whether the key-information sections have anything to show. Null when the lookup itself failed; the failure is reported as an error on this field.',
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
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Loader(PrimarySchoolChildIdLoader)
    childIdLoader: PrimarySchoolChildIdDataLoader,
  ): Promise<PrimarySchoolAgent[]> {
    const childId = await this.childId(student, childIdLoader)
    if (!childId) return []
    const contacts = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.getEmergencyContacts(user, childId),
    )
    return contacts.map((contact) => mapAgent(contact, locale))
  }

  @ResolveField(() => LanguageProfile, { nullable: true })
  async languageProfile(
    @CurrentUser() user: User,
    @Parent() student: PrimarySchoolStudent,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Loader(PrimarySchoolChildIdLoader)
    childIdLoader: PrimarySchoolChildIdDataLoader,
  ): Promise<LanguageProfile | null> {
    const childId = await this.childId(student, childIdLoader)
    if (!childId) return null
    const profile = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.getLanguageProfile(user, childId),
    )
    return mapLanguageProfile(profile, locale)
  }

  @ResolveField(() => HealthProfile, { nullable: true })
  async healthProfile(
    @CurrentUser() user: User,
    @Parent() student: PrimarySchoolStudent,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Loader(PrimarySchoolChildIdLoader)
    childIdLoader: PrimarySchoolChildIdDataLoader,
  ): Promise<HealthProfile | null> {
    const childId = await this.childId(student, childIdLoader)
    if (!childId) return null
    const profile = await withMmsKeyInfoProblem(() =>
      this.keyInfoClient.getHealthProfile(user, childId),
    )
    return mapHealthProfile(profile, locale)
  }

  /** The frigg child id for a student, or null when frigg has no counterpart
   * for it. Frigg keys children on the id we route on (contract v0.3 §4.3), so
   * this answers whether the child exists there rather than translating. */
  private childId(
    student: PrimarySchoolStudent,
    childIdLoader: PrimarySchoolChildIdDataLoader,
  ): Promise<string | null> {
    return childIdLoader.load(student.id)
  }
}
