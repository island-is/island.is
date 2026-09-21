/**
 * PROVISIONAL DTOs for the primary-school "Lykilupplýsingar" (key information)
 * endpoints of the MMS nemendagrunnur form-api (contract v0.2).
 *
 * These hand-written types stand in for `../../gen/fetch/types.gen.ts` until the
 * MMS OpenAPI spec is published. They mirror the JSON in the contract (§4)
 * exactly — do NOT reshape them to suit the UI; the GraphQL mapper
 * (libs/api/domains/education) owns any UI shaping.
 *
 * TODO(MMS v0.2 / connect-the-client): once the spec lands,
 *   1. add its paths to clientConfig.json and run the client codegen,
 *   2. delete this file and import the generated DTOs instead,
 *   3. replace the mocked method bodies in primarySchoolKeyInfoClient.service.ts
 *      with the generated fetch calls (the method signatures already match).
 */

/** A value localised to the UI languages MMS supports. */
export interface LocalizedTitleDto {
  is: string
  en: string
}

/* -- 4.1 Lookup lists ------------------------------------------------------ */

/** GET /agent-relation-types */
export interface AgentRelationTypeDto {
  id: string
  relation: string
  title: LocalizedTitleDto
}

/** `code: "other"` exists in both food and environmental — always key off id. */
export type AllergyTypeDto = 'food' | 'medicine' | 'environmental'

/** GET /allergies */
export interface AllergyDto {
  id: string
  code: string
  type: AllergyTypeDto
  title: LocalizedTitleDto
}

/** GET /language-environments */
export interface LanguageEnvironmentDto {
  id: string
  code: string
  title: LocalizedTitleDto
}

/* -- 4.2 Own contact ------------------------------------------------------- */

/** GET /me/contact — empty fields are null (island.is pre-fills from UserInfo). */
export interface MyContactDto {
  nationalId: string
  name: string
  email: string | null
  phone: string | null
  mobile: string | null
  updatedAt: string
}

/** PATCH /me/contact — whole document, all three fields; null clears. */
export interface MyContactUpdateDto {
  email: string | null
  phone: string | null
  mobile: string | null
}

/* -- 4.3 Children ---------------------------------------------------------- */

export interface ChildSchoolDto {
  id: string
  name: string
  municipality: string
}

/** Whether my guardianship is shared with the other guardian (§2.2). */
export interface ChildGuardianshipDto {
  sharedWithOtherGuardian: boolean
}

/** GET /me/children */
export interface ChildDto {
  id: string
  nationalId: string
  name: string
  preferredName: string | null
  school: ChildSchoolDto
  gradeLevel: string
  myGuardianship: ChildGuardianshipDto
}

/* -- 4.4 Emergency contacts (agents) --------------------------------------- */

/** `guardian` → guardian name, `organization` → school name, `unknown` → older
 * record; the UI must not render a "Skráð af" line for `unknown`. */
export type AgentCreatedByKind = 'guardian' | 'organization' | 'unknown'

export interface AgentPersonDto {
  nationalId: string
  name: string
}

export interface AgentRelationTypeRefDto {
  id: string
  title: LocalizedTitleDto
}

export interface AgentCreatedByDto {
  kind: AgentCreatedByKind
  displayName: string | null
  at: string
}

/** GET /me/children/{childId}/agents — only emergencyContact relations. Email /
 * phone of the contact are never returned here (they are the contact's own). */
export interface ChildAgentDto {
  id: string
  person: AgentPersonDto
  relationType: AgentRelationTypeRefDto
  createdBy: AgentCreatedByDto
  /** Authorisation is computed by MMS, never by the client/frontend. */
  canEdit: boolean
}

/** POST /me/children/{childId}/agents — name is resolved from Þjóðskrá by MMS. */
export interface ChildAgentCreateDto {
  nationalId: string
  relationTypeId: string
}

/** PATCH /me/children/{childId}/agents/{agentId} — only the relation type. */
export interface ChildAgentUpdateDto {
  relationTypeId: string
}

/* -- Shared audit stamp ---------------------------------------------------- */

export interface UpdatedByDto {
  kind: string
  displayName: string | null
}

/* -- 4.5 Health profile ---------------------------------------------------- */

/** GET /me/children/{childId}/health-profile */
export interface HealthProfileDto {
  epipen: boolean
  medicalDiagnoses: boolean
  medicationAssistance: boolean
  allergies: AllergyDto[]
  updatedAt: string
  updatedBy: UpdatedByDto
}

/** PATCH body — whole document; `allergies` is a list of allergy ids (§4.5). */
export interface HealthProfileUpdateDto {
  epipen: boolean
  medicalDiagnoses: boolean
  medicationAssistance: boolean
  allergies: string[]
}

/* -- 4.6 Language profile -------------------------------------------------- */

/** GET /me/children/{childId}/language-profile */
export interface LanguageProfileDto {
  languageEnvironment: LanguageEnvironmentDto
  /** ISO 639-1 */
  preferredLanguage: string | null
  /** ISO 639-1 */
  languages: string[]
  interpreter: boolean
  signLanguage: boolean
  updatedAt: string
  updatedBy: UpdatedByDto
}

/** PATCH body — whole document. */
export interface LanguageProfileUpdateDto {
  languageEnvironmentId: string | null
  preferredLanguage: string | null
  languages: string[]
  interpreter: boolean
  signLanguage: boolean
}
