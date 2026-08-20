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
  getSubCriterionCatalog = 'getSubCriterionCatalog',
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
  listDraftCriteria = 'listDraftCriteria',
  listDraftRoles = 'listDraftRoles',
  // Only SalaryAnalysisResults still uses this — it needs the full id<->ordinal
  // mapping across every employee to seed/sync outlier groups, which can't be
  // paginated (a group can reference employees from anywhere in the set).
  listDraftEmployees = 'listDraftEmployees',
  listDraftOutlierGroups = 'listDraftOutlierGroups',
}

export const PERIOD_ONE_MONTH = 'oneMonth'
export const PERIOD_TWELVE_MONTHS = 'twelveMonths'

// Live server-paginated employee queries (EmployeesEditor, EmployeeClassificationEditor).
export const DRAFT_EMPLOYEES_PAGE_SIZE = 25

// Duplicated from the client lib rather than imported — importing it as a value
// pulls in that package's NestJS module (backend-only deps), breaking the frontend bundle.
export const SyncMethodEnum = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  REMOVE: 'REMOVE',
} as const
export type SyncMethodEnum = typeof SyncMethodEnum[keyof typeof SyncMethodEnum]

// Builder function, not a constant — each application needs its own fresh client-minted UUIDs.
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
