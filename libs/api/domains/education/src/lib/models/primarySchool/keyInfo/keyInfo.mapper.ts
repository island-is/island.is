import { FOOD_ALLERGY_TYPE } from '@island.is/clients/mms/frigg'
import { LocaleEnum } from '@island.is/nest/graphql'
import {
  AllergyCategory,
  KeyInfoActorKind,
} from '../../../enums/primarySchoolKeyInfo.enum'
import { PrimarySchoolAgent } from './agent.model'
import { Allergy, LanguageEnvironment, RelationType } from './lookups.model'
import { HealthProfile, LanguageProfile } from './profiles.model'

/**
 * Maps the Frigg "Mínar síður" DTOs onto the education GraphQL models. Frigg
 * serves titles as `value: [{content, language}]` key-option translations and
 * leaves the choice to the caller, so every mapper takes the locale the client
 * asked for and resolves the title here. Audit `date-time` fields arrive as
 * `Date` (openapi-generator), so they are serialised back to ISO strings.
 */

/**
 * What the mapper reads from each frigg DTO. Stated here rather than taken from
 * the generated client so the shapes stay checked where the resolvers hand the
 * real DTOs in, and the spec can build plain fixtures.
 */
interface KeyOptionInput {
  id: string
  key: string
  value?: Array<{ content: string; language: string }>
}

interface AllergyInput extends KeyOptionInput {
  type: string
}

interface ActorInput {
  kind: string
  displayName?: string | null
}

interface EmergencyContactInput {
  id: string
  person: { nationalId: string; name: string }
  relationType?: KeyOptionInput | null
  createdBy: ActorInput & { at: Date }
  canEdit: boolean
}

interface HealthProfileInput {
  epipen: boolean
  medicalDiagnoses: boolean
  medicationAssistance: boolean
  allergies: Array<AllergyInput>
  updatedAt?: Date | null
  updatedBy?: ActorInput | null
}

interface LanguageProfileInput {
  languageEnvironment?: KeyOptionInput | null
  preferredLanguage?: string | null
  languages: Array<string>
  interpreter: boolean
  signLanguage: boolean
  updatedAt?: Date | null
  updatedBy?: ActorInput | null
}

/** Picks a key-option's title in `locale`, falling back to the first
 * translation when frigg has no entry for it. */
const localize = (
  value: Array<{ content: string; language: string }> | undefined,
  locale: LocaleEnum,
): string =>
  value?.find((v) => v.language === locale)?.content ??
  value?.[0]?.content ??
  ''

/** Orders a lookup list by its resolved title, so the client renders it in the
 * order the active locale reads in rather than frigg's insertion order. */
export const byTitle =
  (locale: LocaleEnum) =>
  (a: { title: string }, b: { title: string }): number =>
    a.title.localeCompare(b.title, locale)

export const mapRelationType = (
  option: KeyOptionInput,
  locale: LocaleEnum,
): RelationType => ({
  id: option.id,
  relation: option.key,
  title: localize(option.value, locale),
})

/**
 * MMS uses two different vocabularies for an allergy's `type`. The lookup lists
 * are served under two key-option types (`foodAllergyAndIntolerance` and
 * `allergy`), while the allergies stored on a health profile carry a
 * three-value `AllergyOutput.type` enum (food | medicine | environmental).
 *
 * The three-value enum cannot be derived from the lookups: the flat `allergy`
 * list mixes medicine and environmental allergens with nothing in the payload
 * to tell them apart. So both sides are normalised to the two categories MMS
 * genuinely models, and `mapHealthAllergy` folds medicine and environmental
 * into `other`.
 */
const toAllergyCategory = (keyOptionType: string): AllergyCategory =>
  keyOptionType === FOOD_ALLERGY_TYPE
    ? AllergyCategory.Food
    : AllergyCategory.Other

/** Frigg's two `kind` enums overlap but are not identical, and older records
 * carry values from neither. */
const toActorKind = (kind: string): KeyInfoActorKind =>
  Object.values(KeyInfoActorKind).find((known) => known === kind) ??
  KeyInfoActorKind.Unknown

/** Allergy *lookup* option, tagged with the category the UI groups by. */
export const mapAllergyOption = (
  option: AllergyInput,
  locale: LocaleEnum,
): Allergy => ({
  id: option.id,
  code: option.key,
  type: toAllergyCategory(option.type),
  title: localize(option.value, locale),
})

/**
 * Allergy as stored on a health profile. MMS tags these with its three-value
 * enum, so `medicine` and `environmental` are folded into `other` to match the
 * two categories the lookup lists (and therefore the UI) are built around.
 */
const mapHealthAllergy = (dto: AllergyInput, locale: LocaleEnum): Allergy => ({
  id: dto.id,
  code: dto.key,
  type: dto.type === 'food' ? AllergyCategory.Food : AllergyCategory.Other,
  title: localize(dto.value, locale),
})

export const mapLanguageEnvironment = (
  option: KeyOptionInput,
  locale: LocaleEnum,
): LanguageEnvironment => ({
  id: option.id,
  code: option.key,
  title: localize(option.value, locale),
})

export const mapAgent = (
  dto: EmergencyContactInput,
  locale: LocaleEnum,
): PrimarySchoolAgent => ({
  id: dto.id,
  person: { nationalId: dto.person.nationalId, name: dto.person.name },
  relationType: dto.relationType
    ? {
        id: dto.relationType.id,
        title: localize(dto.relationType.value, locale),
      }
    : undefined,
  createdBy: {
    kind: toActorKind(dto.createdBy.kind),
    displayName: dto.createdBy.displayName ?? undefined,
    at: dto.createdBy.at,
  },
  canEdit: dto.canEdit,
})

export const mapHealthProfile = (
  dto: HealthProfileInput,
  locale: LocaleEnum,
): HealthProfile => ({
  epipen: dto.epipen,
  medicalDiagnoses: dto.medicalDiagnoses,
  medicationAssistance: dto.medicationAssistance,
  allergies: dto.allergies.map((allergy) => mapHealthAllergy(allergy, locale)),
  updatedAt: dto.updatedAt ?? undefined,
  updatedBy: dto.updatedBy
    ? {
        kind: toActorKind(dto.updatedBy.kind),
        displayName: dto.updatedBy.displayName ?? undefined,
      }
    : undefined,
})

export const mapLanguageProfile = (
  dto: LanguageProfileInput,
  locale: LocaleEnum,
): LanguageProfile => ({
  languageEnvironment: dto.languageEnvironment
    ? mapLanguageEnvironment(dto.languageEnvironment, locale)
    : undefined,
  preferredLanguage: dto.preferredLanguage ?? undefined,
  languages: dto.languages,
  interpreter: dto.interpreter,
  signLanguage: dto.signLanguage,
  updatedAt: dto.updatedAt ?? undefined,
  updatedBy: dto.updatedBy
    ? {
        kind: toActorKind(dto.updatedBy.kind),
        displayName: dto.updatedBy.displayName ?? undefined,
      }
    : undefined,
})
