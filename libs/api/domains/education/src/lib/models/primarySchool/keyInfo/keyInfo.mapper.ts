import type {
  AllergyOption,
  AllergyOutput,
  EmergencyContactOutput,
  HealthProfileOutput,
  LanguageProfileOutput,
  Option,
} from '@island.is/clients/mms/frigg'
import { PrimarySchoolAgent } from './agent.model'
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

const localize = (
  value: Array<{ content: string; language: string }>,
): LocalizedText => ({
  is: value.find((v) => v.language === 'is')?.content ?? value[0]?.content ?? '',
  en: value.find((v) => v.language === 'en')?.content ?? value[0]?.content ?? '',
})

export const mapRelationType = (option: Option): RelationType => ({
  id: option.id,
  relation: option.key,
  title: localize(option.value),
})

/** Allergy *lookup* option — `type` is the key-option type it was served under
 * (`allergy` | `foodAllergyAndIntolerance`). */
export const mapAllergyOption = (option: AllergyOption): Allergy => ({
  id: option.id,
  code: option.key,
  type: option.type,
  title: localize(option.value),
})

/** Allergy as stored on a health profile — carries its own `type` enum. */
const mapHealthAllergy = (dto: AllergyOutput): Allergy => ({
  id: dto.id,
  code: dto.key,
  type: dto.type,
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
