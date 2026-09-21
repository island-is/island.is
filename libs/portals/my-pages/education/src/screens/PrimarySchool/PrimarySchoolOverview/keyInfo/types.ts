/**
 * PROVISIONAL types for the primary-school "Lykilupplýsingar" (key information)
 * sections shown on Mínar síður → Menntun → Grunnskóli → Nemandi → Yfirlit.
 *
 * These are derived from the MMS contract v0.2 ticket (10.09.2026), NOT from a
 * machine-readable OpenAPI spec. They exist only so the UI can be scaffolded
 * against a typed data seam.
 *
 * TODO(MMS v0.2): once the MMS contract lands and the endpoints are added to
 * libs/clients/mms/primary-school (clientConfig.json → codegen) and exposed via
 * the education GraphQL resolver, REPLACE every type here with the generated
 * GraphQL types and delete this file. Do not treat these field names/enum
 * values as authoritative — flag mismatches against the contract rather than
 * silently adapting.
 */

/** GET /key-options?type=... — a single lookup option. */
export interface KeyOption {
  id: string
  label: string
}

/* -------------------------------------------------------------------------- */
/* 1. Aðstandendur (emergency contacts)                                        */
/* -------------------------------------------------------------------------- */

/**
 * Who registered a contact. When `kind === 'unknown'` the UI must NOT render the
 * "Skráð af" line (per ticket).
 */
export interface EmergencyContactCreatedBy {
  kind: string
  name?: string
}

/** GET /me/children/{childId}/emergency-contacts */
export interface EmergencyContact {
  id: string
  name: string
  nationalId: string
  /** id into key-options?type=relation */
  relationTypeId: string
  /** resolved display label for the relation type, if provided by MMS */
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
  /** ISO 639-1 two-letter code */
  preferredLanguage?: string
  /** ISO 639-1 two-letter codes */
  languages: string[]
  interpreter: boolean
  signLanguage: boolean
}

/** PATCH body */
export interface LanguageProfileUpdateInput {
  languageEnvironmentId?: string
  preferredLanguage?: string
  languages: string[]
  interpreter: boolean
  signLanguage: boolean
}

/* -------------------------------------------------------------------------- */
/* 3. Heilsufarsupplýsingar (health profile)                                   */
/* -------------------------------------------------------------------------- */

/** Categorisation of an allergy, taken from `allergies[].type` (per ticket). */
export enum AllergyCategory {
  Food = 'food',
  Medicine = 'medicine',
  Environmental = 'environmental',
}

export interface Allergy {
  id: string
  /** one of AllergyCategory; kept as string so an unknown value never crashes */
  type: string
  label: string
}

/**
 * GET /allergies — the selectable allergy reference list (not per-child). One
 * flat list covering all categories; `type` splits it into food / medicine /
 * environmental (values match AllergyCategory).
 */
export interface AllergyOption {
  id: string
  code: string
  /** one of AllergyCategory; kept as string so an unknown value never crashes */
  type: string
  /** localised label, one entry per supported UI language */
  title: {
    is: string
    en: string
  }
}

/** GET /me/children/{childId}/health-profile */
export interface HealthProfile {
  allergies: Allergy[]
  /** only meaningful when at least one allergy is registered */
  epipen: boolean
  medicalDiagnoses: boolean
  medicationAssistance?: boolean
}

/** PATCH body — a whole document (per ticket). */
export interface HealthProfileUpdateInput {
  allergies: Allergy[]
  epipen: boolean
  medicalDiagnoses: boolean
  medicationAssistance?: boolean
}

/* -------------------------------------------------------------------------- */
/* Errors                                                                      */
/* -------------------------------------------------------------------------- */

/** MMS error codes to handle explicitly (per ticket §5). */
export enum MmsErrorCode {
  Validation = 'VALIDATION',
  NotAGuardian = 'NOT_A_GUARDIAN',
  DelegationNotSupported = 'DELEGATION_NOT_SUPPORTED',
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
  /** must be preserved/surfaced so failures can be traced with MMS (ticket §5) */
  requestId?: string
}
