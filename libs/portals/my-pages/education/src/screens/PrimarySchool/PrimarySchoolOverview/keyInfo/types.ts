/**
 * View models for the primary-school "Lykilupplýsingar" (key information)
 * sections shown on Mínar síður → Menntun → Grunnskóli → Nemandi → Yfirlit.
 *
 * The generated GraphQL types nest their lookups, which every section and form
 * would otherwise unpack for itself. These are what the sections read once
 * usePrimarySchoolKeyInfo has flattened them; the generated types stay the
 * source of truth for the wire shape.
 */

import {
  EducationPrimarySchoolActorKind,
  EducationPrimarySchoolAllergyCategory,
} from '@island.is/api/schema'

export { EducationPrimarySchoolActorKind }
/** MMS serves one key-option list per category, so these are the only two. */
export { EducationPrimarySchoolAllergyCategory as AllergyCategory }

/* -------------------------------------------------------------------------- */
/* 1. Aðstandendur (emergency contacts)                                        */
/* -------------------------------------------------------------------------- */

/**
 * Who registered a contact. When `kind` is `Unknown` the UI must NOT render the
 * "Skráð af" line (contract §7.2).
 */
export interface EmergencyContactCreatedBy {
  kind: EducationPrimarySchoolActorKind
  name?: string
}

/** GET /me/children/{childId}/emergency-contacts */
export interface EmergencyContact {
  id: string
  name: string
  nationalId: string
  /** id into key-options?type=relation; absent on legacy records */
  relationTypeId?: string
  relationTypeLabel?: string
  createdBy?: EmergencyContactCreatedBy
  /** ISO date string; only present for some records */
  createdDate?: string
  /**
   * Authorization is computed by MMS, never by the frontend.
   * true → show Breyta / Fjarlægja, false → read-only.
   */
  canEdit: boolean
}

/** POST body — name is resolved by MMS/Þjóðskrá from the national id. */
export interface EmergencyContactCreateInput {
  nationalId: string
  relationTypeId: string
}

/** PATCH body — only the relation type is editable. */
export interface EmergencyContactUpdateInput {
  relationTypeId: string
}

/* -------------------------------------------------------------------------- */
/* 2. Tungumálaumhverfi (language profile)                                     */
/* -------------------------------------------------------------------------- */

/** GET /me/children/{childId}/language-profile */
export interface LanguageProfile {
  /** id into key-options?type=languageEnvironment */
  languageEnvironmentId?: string
  languageEnvironmentLabel?: string
  /** Language code from the Ísland.is list (BCP 47; `is`, `fil`, `zh-CN`) */
  preferredLanguage?: string
  /** Language codes from the Ísland.is list (BCP 47; not all two-letter) */
  languages: string[]
  interpreter: boolean
  signLanguage: boolean
}

/** PATCH body */
export interface LanguageProfileUpdateInput {
  languageEnvironmentId: string
  preferredLanguage?: string
  languages: string[]
  interpreter: boolean
  signLanguage: boolean
}

/* -------------------------------------------------------------------------- */
/* 3. Heilsufarsupplýsingar (health profile)                                   */
/* -------------------------------------------------------------------------- */

export interface Allergy {
  id: string
  type: EducationPrimarySchoolAllergyCategory
  label: string
}

/** GET /me/children/{childId}/health-profile */
export interface HealthProfile {
  allergies: Allergy[]
  /** only meaningful when at least one allergy is registered */
  epipen: boolean
  medicalDiagnoses: boolean
  medicationAssistance?: boolean
}

/** PATCH body — a whole document (contract §4.5). */
export interface HealthProfileUpdateInput {
  allergies: Allergy[]
  epipen: boolean
  medicalDiagnoses: boolean
  medicationAssistance?: boolean
}

/* -------------------------------------------------------------------------- */
/* Section state                                                               */
/* -------------------------------------------------------------------------- */

/** What each key-info section receives: its data plus its own fetch state. */
export interface SectionState<T> {
  data: T | undefined
  loading: boolean
  error: MmsError | undefined
}

/* -------------------------------------------------------------------------- */
/* Errors                                                                      */
/* -------------------------------------------------------------------------- */

/** MMS error codes (contract v0.3 §6). The api forwards whatever code MMS
 * reported; {@link mmsErrorMessage} explains the ones we can and leaves the
 * rest to the generic message. */
export enum MmsErrorCode {
  Validation = 'VALIDATION',
  NotAGuardian = 'NOT_A_GUARDIAN',
  DelegationNotSupported = 'DELEGATION_NOT_SUPPORTED',
  /** Token is missing a scope the route requires — all four are asked for in
   * one token exchange, so this takes the reads down with the writes. */
  InsufficientScope = 'INSUFFICIENT_SCOPE',
  NotEditable = 'NOT_EDITABLE',
  FeatureDisabled = 'FEATURE_DISABLED',
  NotFound = 'NOT_FOUND',
  AgentExists = 'AGENT_EXISTS',
  PersonNotFound = 'PERSON_NOT_FOUND',
  IsGuardian = 'IS_GUARDIAN',
  InvalidReference = 'INVALID_REFERENCE',
}

export interface MmsError {
  code?: string
  message?: string
  /** Request id MMS sent with the failure, so it can be traced with them
   * (contract §6). */
  requestId?: string
}
