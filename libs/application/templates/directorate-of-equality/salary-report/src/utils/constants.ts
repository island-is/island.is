import { DefaultEvents } from '@island.is/application/types'
import { JobFactor, SalaryComponentKey, SubCriterion } from './types'

export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.ABORT
    | DefaultEvents.APPROVE
    | DefaultEvents.REJECT
    | DefaultEvents.EDIT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
  APPROVED = 'approved',
  DENIED = 'denied',
  POSTPONED = 'postponed',
  NOT_ALLOWED = 'notAllowed',
  DRAFT_RETRY = 'draftRetry',
}

export enum Roles {
  APPLICANT = 'applicant',
  NOT_ALLOWED = 'notAllowed',
}

export enum ApiActions {
  getCompanyData = 'getCompanyData',
  getDoeCompany = 'getDoeCompany',
  getActiveEqualityReport = 'getActiveEqualityReport',
  getBlankExcelTemplate = 'getBlankExcelTemplate',
  presignImportUpload = 'presignImportUpload',
  createSalaryDraft = 'createSalaryDraft',
  importSalaryDraftWorkbook = 'importSalaryDraftWorkbook',
  submitSalaryReport = 'submitSalaryReport',
  analyzeSalaryReport = 'analyzeSalaryReport',
  editOutliers = 'editOutliers',
  getReportComments = 'getReportComments',
  submitReportComment = 'submitReportComment',
  getDraftHeader = 'getDraftHeader',
  getDraftCriteriaTree = 'getDraftCriteriaTree',
  listDraftRolesWithSteps = 'listDraftRolesWithSteps',
  listDraftEmployeesWithSteps = 'listDraftEmployeesWithSteps',
  listDraftCriteria = 'listDraftCriteria',
  listDraftRoles = 'listDraftRoles',
  listDraftEmployees = 'listDraftEmployees',
  listDraftOutlierGroups = 'listDraftOutlierGroups',
}

export const PERIOD_ONE_MONTH = 'oneMonth'
export const PERIOD_TWELVE_MONTHS = 'twelveMonths'

// Mirrors the generated `SyncMethodEnum` from @island.is/clients/directorate-of-equality.
// Duplicated locally rather than imported: that package's barrel also re-exports its
// NestJS client module, which pulls in backend-only deps (auth, X-Road config, node
// built-ins) that break the frontend bundle when this enum's runtime value is imported
// as a value (its DTO types are import-type-only and erase fine, but this doesn't).
export const SyncMethodEnum = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  REMOVE: 'REMOVE',
} as const
export type SyncMethodEnum = typeof SyncMethodEnum[keyof typeof SyncMethodEnum]

// Builder functions, not fixed objects — every job/sub-criterion/step needs
// its own client-minted UUID (the draft sync API's join key), so a shared
// module-level constant would hand every application the same id. Called
// fresh each time the defaults are seeded.
export const createDefaultJobFactors = (): JobFactor[] => [
  {
    id: crypto.randomUUID(),
    type: 'RESPONSIBILITY',
    title: 'Ábyrgð',
    description:
      'Metur ábyrgð starfsins á fólki, fjármálum, gæðum og öðrum þáttum.',
    weight: '25',
  },
  {
    id: crypto.randomUUID(),
    type: 'STRAIN',
    title: 'Álag',
    description:
      'Metur hraða, tímaþrýsting, líkamlegt og tilfinningalegt álag.',
    weight: '25',
  },
  {
    id: crypto.randomUUID(),
    type: 'CONDITION',
    title: 'Vinnuaðstæður',
    description:
      'Metur vaktavinnu, ferðalög, áhættu og aðrar aðstæður starfsins.',
    weight: '25',
  },
  {
    id: crypto.randomUUID(),
    type: 'COMPETENCE',
    title: 'Hæfni',
    description:
      'Metur menntunarkröfur, reynslukröfur og sérhæfingu starfsins.',
    weight: '25',
  },
]

export const createDefaultSubCriterion = (
  criterionId: string,
): SubCriterion => ({
  id: crypto.randomUUID(),
  criterionId,
  title: '',
  description: '',
  weight: '',
  stepCount: '2',
  steps: [
    { id: crypto.randomUUID(), description: '' },
    { id: crypto.randomUUID(), description: '' },
  ],
})

export const SALARY_COMPONENT_GROUPS: {
  group: 'additional' | 'bonus'
  keys: SalaryComponentKey[]
}[] = [
  {
    group: 'additional',
    keys: ['additionalFixedOvertime', 'additionalFixedCarAllowance'],
  },
  {
    group: 'bonus',
    keys: [
      'bonusOccasionalCarAllowance',
      'bonusOccasionalOvertime',
      'bonusPayments',
      'bonusOther',
    ],
  },
]

export const SALARY_COMPONENT_KEYS: SalaryComponentKey[] =
  SALARY_COMPONENT_GROUPS.flatMap((g) => g.keys)

// NOTE: Icelandic labels below are best-guess mappings of the API enums —
// adjust wording as needed.
export const GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: 'FEMALE', label: 'Kona' },
  { value: 'MALE', label: 'Karl' },
  { value: 'NEUTRAL', label: 'Kynsegin/annað' },
]

export const GENDER_LABELS: Record<string, string> = Object.fromEntries(
  GENDER_OPTIONS.map((o) => [o.value, o.label]),
)
