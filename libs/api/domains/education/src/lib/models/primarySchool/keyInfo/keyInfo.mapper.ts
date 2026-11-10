import {
  FOOD_ALLERGY_TYPE,
  type AllergyOption,
  type AllergyOutput,
  type EmergencyContactOutput,
  type HealthProfileOutput,
  type LanguageProfileOutput,
  type Option,
} from '@island.is/clients/mms/frigg'
import type { Locale } from '@island.is/shared/types'
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

/** A key-option carrying its localised labels — shared by the lookup `Option`
 * and the `KeyOptionOutput` embedded in contacts / language profiles. */
interface LocalizableKeyOption {
  id: string
  key: string
  value: Array<{ content: string; language: string }>
}

/** Picks a key-option's title in `locale`, falling back to the first
 * translation when frigg has no entry for it. */
const localize = (
  value: Array<{ content: string; language: string }> | undefined,
  locale: Locale,
): string =>
  value?.find((v) => v.language === locale)?.content ??
  value?.[0]?.content ??
  ''

/** Orders a lookup list by its resolved title, so the client renders it in the
 * order the active locale reads in rather than frigg's insertion order. */
export const byTitle =
  (locale: Locale) =>
  (a: { title: string }, b: { title: string }): number =>
    a.title.localeCompare(b.title, locale)

export const mapRelationType = (
  option: Option,
  locale: Locale,
): RelationType => ({
  id: option.id,
  relation: option.key,
  title: localize(option.value, locale),
})

/**
 * The two categories the UI groups allergies by, matching how MMS actually
 * serves them: one key-option list per category.
 */
type AllergyCategory = 'food' | 'other'

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
  keyOptionType === FOOD_ALLERGY_TYPE ? 'food' : 'other'

/** Allergy *lookup* option, tagged with the category the UI groups by. */
export const mapAllergyOption = (
  option: AllergyOption,
  locale: Locale,
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
const mapHealthAllergy = (dto: AllergyOutput, locale: Locale): Allergy => ({
  id: dto.id,
  code: dto.key,
  type: dto.type === 'food' ? 'food' : 'other',
  title: localize(dto.value, locale),
})

export const mapLanguageEnvironment = (
  option: LocalizableKeyOption,
  locale: Locale,
): LanguageEnvironment => ({
  id: option.id,
  code: option.key,
  title: localize(option.value, locale),
})

export const mapAgent = (
  dto: EmergencyContactOutput,
  locale: Locale,
): PrimarySchoolAgent => ({
  id: dto.id,
  person: { nationalId: dto.person.nationalId, name: dto.person.name },
  // MMS allows a contact with no relation type (legacy / unknown records). The
  // GraphQL field is required, so fall back to an empty label rather than null.
  relationType: dto.relationType
    ? {
        id: dto.relationType.id,
        title: localize(dto.relationType.value, locale),
      }
    : { id: '', title: '' },
  createdBy: {
    kind: dto.createdBy.kind,
    displayName: dto.createdBy.displayName ?? undefined,
    at: dto.createdBy.at.toISOString(),
  },
  canEdit: dto.canEdit,
})

export const mapHealthProfile = (
  dto: HealthProfileOutput,
  locale: Locale,
): HealthProfile => ({
  epipen: dto.epipen,
  medicalDiagnoses: dto.medicalDiagnoses,
  medicationAssistance: dto.medicationAssistance,
  allergies: dto.allergies.map((allergy) => mapHealthAllergy(allergy, locale)),
  updatedAt: dto.updatedAt?.toISOString(),
  updatedBy: dto.updatedBy
    ? {
        kind: dto.updatedBy.kind,
        displayName: dto.updatedBy.displayName ?? undefined,
      }
    : undefined,
})

export const mapLanguageProfile = (
  dto: LanguageProfileOutput,
  locale: Locale,
): LanguageProfile => ({
  languageEnvironment: dto.languageEnvironment
    ? mapLanguageEnvironment(dto.languageEnvironment, locale)
    : undefined,
  preferredLanguage: dto.preferredLanguage ?? undefined,
  languages: dto.languages,
  interpreter: dto.interpreter,
  signLanguage: dto.signLanguage,
  updatedAt: dto.updatedAt?.toISOString(),
  updatedBy: dto.updatedBy
    ? {
        kind: dto.updatedBy.kind,
        displayName: dto.updatedBy.displayName ?? undefined,
      }
    : undefined,
})
