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
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { LocaleEnum } from '@island.is/nest/graphql'
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
 * contacts, language profile and health profile, from the MMS frigg form-api
 * (contract v0.2 §4). The lookup lists they pick from are per-user, not
 * per-student, and live in {@link PrimarySchoolKeyInfoOptionsResolver}.
 *
 * Frigg keys children on the same id these screens route on (contract v0.3
 * §4.3), so the only lookup needed is whether frigg has the child at all —
 * {@link PrimarySchoolChildIdLoader} answers that from one `listChildren` call
 * per request. A child it does not have reads as "no information" so the
 * overview still renders; the mutations fail instead.
 */
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isServicePortalPrimarySchoolKeyInfoEnabled)
@Scopes(ApiScope.education)
@Resolver(() => PrimarySchoolStudent)
export class PrimarySchoolKeyInfoResolver {
  constructor(private readonly keyInfoClient: FriggKeyInfoClientService) {}

  /** Nullable on purpose: a non-nullable field that throws takes
   * `primarySchoolStudent` down with it, which the portal caches as a null root
   * field and blanks the base info and assessment tab too. Null means the
   * lookup failed; `false` means frigg does not have this child. */
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
    @Args('locale', { type: () => LocaleEnum, nullable: true })
    locale: LocaleEnum = LocaleEnum.Is,
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
    @Args('locale', { type: () => LocaleEnum, nullable: true })
    locale: LocaleEnum = LocaleEnum.Is,
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
    @Args('locale', { type: () => LocaleEnum, nullable: true })
    locale: LocaleEnum = LocaleEnum.Is,
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
