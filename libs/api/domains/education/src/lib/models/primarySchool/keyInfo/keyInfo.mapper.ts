import {
  FOOD_ALLERGY_TYPE,
  type AllergyOption,
  type AllergyOutput,
  type ChildOutput,
  type EmergencyContactOutput,
  type HealthProfileOutput,
  type LanguageProfileOutput,
  type Option,
} from '@island.is/clients/mms/frigg'
import { PrimarySchoolAgent } from './agent.model'
import { PrimarySchoolChild } from './child.model'
import { Allergy, LanguageEnvironment, RelationType } from './lookups.model'
import { LocalizedText } from './localizedText.model'
import { HealthProfile, LanguageProfile } from './profiles.model'

/**
 * Maps the Frigg "Mínar síður" DTOs onto the education GraphQL models. MMS keeps
 * the server locale-agnostic: titles arrive as `value: [{content, language}]`
 * key-option translations — `localize` folds those into the `{is, en}` shape the
 * frontend reads. Audit `date-time` fields arrive as `Date` (openapi-generator),
 * so they are serialised back to ISO strings here.
 */

/** A key-option carrying its localised labels — shared by the lookup `Option`
 * and the `KeyOptionOutput` embedded in contacts / language profiles. */
interface LocalizableKeyOption {
  id: string
  key: string
  value: Array<{ content: string; language: string }>
}

/** Folds a key-option's translations into the `{is, en}` shape the frontend
 * reads, falling back to the first translation when a locale is missing. */
const localize = (
  value: Array<{ content: string; language: string }> | undefined,
): LocalizedText => ({
  is:
    value?.find((v) => v.language === 'is')?.content ??
    value?.[0]?.content ??
    '',
  en:
    value?.find((v) => v.language === 'en')?.content ??
    value?.[0]?.content ??
    '',
})

export const mapChild = (dto: ChildOutput): PrimarySchoolChild => ({
  id: dto.id,
  nationalId: dto.nationalId,
  name: dto.name,
  preferredName: dto.preferredName ?? undefined,
  gradeLevel: dto.gradeLevel ?? undefined,
})

export const mapRelationType = (option: Option): RelationType => ({
  id: option.id,
  relation: option.key,
  title: localize(option.value),
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
export const mapAllergyOption = (option: AllergyOption): Allergy => ({
  id: option.id,
  code: option.key,
  type: toAllergyCategory(option.type),
  title: localize(option.value),
})

/**
 * Allergy as stored on a health profile. MMS tags these with its three-value
 * enum, so `medicine` and `environmental` are folded into `other` to match the
 * two categories the lookup lists (and therefore the UI) are built around.
 */
const mapHealthAllergy = (dto: AllergyOutput): Allergy => ({
  id: dto.id,
  code: dto.key,
  type: dto.type === 'food' ? 'food' : 'other',
  title: localize(dto.value),
})

export const mapLanguageEnvironment = (
  option: LocalizableKeyOption,
): LanguageEnvironment => ({
  id: option.id,
  code: option.key,
  title: localize(option.value),
})

export const mapAgent = (dto: EmergencyContactOutput): PrimarySchoolAgent => ({
  id: dto.id,
  person: { nationalId: dto.person.nationalId, name: dto.person.name },
  // MMS allows a contact with no relation type (legacy / unknown records). The
  // GraphQL field is required, so fall back to an empty label rather than null.
  relationType: dto.relationType
    ? { id: dto.relationType.id, title: localize(dto.relationType.value) }
    : { id: '', title: { is: '', en: '' } },
  createdBy: {
    kind: dto.createdBy.kind,
    displayName: dto.createdBy.displayName ?? undefined,
    at: dto.createdBy.at.toISOString(),
  },
  canEdit: dto.canEdit,
})

export const mapHealthProfile = (dto: HealthProfileOutput): HealthProfile => ({
  epipen: dto.epipen,
  medicalDiagnoses: dto.medicalDiagnoses,
  medicationAssistance: dto.medicationAssistance,
  allergies: dto.allergies.map(mapHealthAllergy),
  updatedAt: dto.updatedAt?.toISOString(),
  updatedBy: dto.updatedBy
    ? {
        kind: dto.updatedBy.kind,
        displayName: dto.updatedBy.displayName ?? undefined,
      }
    : undefined,
  // The health PATCH endpoint is live, so the profile is editable. (Previously
  // gated behind a mock flag while §8 kept the endpoint closed.)
  canEdit: true,
})

export const mapLanguageProfile = (
  dto: LanguageProfileOutput,
): LanguageProfile => ({
  languageEnvironment: dto.languageEnvironment
    ? mapLanguageEnvironment(dto.languageEnvironment)
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
