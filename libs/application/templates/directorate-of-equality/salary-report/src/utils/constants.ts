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
  // The receipt state: the report is in, the úrbótaáætlun is not. Its whole
  // form is the "Sending móttekin" screen, and PostponeReceiptCloser moves the
  // application on to POSTPONED as the applicant leaves it. A state rather than
  // an answer flag so the receipt cannot be reached again — it belongs to a
  // form the applicant is no longer in.
  POSTPONE_RECEIVED = 'postponeReceived',
  POSTPONED = 'postponed',
  NOT_ALLOWED = 'notAllowed',
  DRAFT_RETRY = 'draftRetry',
}

export enum Roles {
  APPLICANT = 'applicant',
  NOT_ALLOWED = 'notAllowed',
  ASSIGNEE = 'assignee',
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
  // Salary-analysis screens need the full employee list: the extra-pay table
  // derives totals from it, and outlier-group sync needs the full id<->ordinal
  // mapping because a group can reference employees from anywhere in the set.
  listDraftEmployees = 'listDraftEmployees',
  listDraftOutlierGroups = 'listDraftOutlierGroups',
}

// Screen ids the form builders declare and other screens navigate to.
// `goToScreen` and `backId` fail silently on an unknown id, so the definitions
// and the references share one source and a rename becomes a compile error.
export const ScreenIds = {
  criteria: 'criteriaMultiField',
  analysisOverview: 'salaryAnalysisOverviewMultiField',
  improvementPlan: 'salaryAnalysisImprovementPlanMultiField',
} as const

const DOE_NAMESPACE = 'DirectorateOfEquality'

// Builds the `actionId` string the updateApplicationExternalData mutation expects,
// from the same ApiActions enum the data providers and the service dispatch on —
// a renamed action is then caught by the type checker at every call site.
export const draftActionId = (action: ApiActions) =>
  `${DOE_NAMESPACE}.${action}`

export const PERIOD_ONE_MONTH = 'oneMonth'
export const PERIOD_TWELVE_MONTHS = 'twelveMonths'

// Live server-paginated employee queries (EmployeesEditor, EmployeeClassificationEditor).
export const DRAFT_EMPLOYEES_PAGE_SIZE = 25

// Greiddar stundir bounds, mirrored from the API (DECIMAL(6,2)). The lower
// bound rejects a starfshlutfall carried into the field — 0,8 or 1 would
// otherwise pass validation and inflate reglulegt tímakaup ~173x.
export const PAID_HOURS_MIN = 4
export const PAID_HOURS_MAX = 750

// How far out "Dagsetning úrbóta" may be set, mirrored from the API: past this
// the date belongs to a reporting period the report can't speak for.
export const REMEDY_DATE_MAX_YEARS_AHEAD = 3

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
