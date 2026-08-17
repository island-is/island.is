export type {
  DraftCriterionWithSubCriteriaDto,
  DraftEmployeeWithStepsDto,
  DraftOutlierGroupDto,
  DraftRoleWithStepsDto,
  DraftSubCriterionWithStepsDto,
  ReportCriterionDto,
  ReportEmployeeDto,
  ReportEmployeeRoleDto,
  ReportSubCriterionStepDto,
} from '@island.is/clients/directorate-of-equality'

export type JobFactor = {
  id: string
  type: string
  title: string
  description: string
  weight: string
}

export type PersonalFactor = {
  id: string
  title: string
  description?: string
  weight: string
}

export type SubCriterionStep = {
  id: string
  description: string
}

export type SubCriterion = {
  id: string
  // Client-minted UUID of the parent criterion (job or personal factor) this
  // sub-criterion belongs to — the join key the draft's sync API expects
  // instead of a criterion title.
  criterionId: string
  title: string
  description?: string
  weight: string
  stepCount: string
  steps: SubCriterionStep[]
}

// Was `{criterionTitle, subTitle, stepOrder}` — the draft's sync API keys
// role/employee step assignments by the step's own client-minted UUID
// instead, so a flat id is all that's needed. Criterion/sub-criterion context
// for display is looked up from the criteria/subCriteria collections by this
// id, not carried alongside it.
export type StepAssignment = { stepId: string }

// The API's per-key salary breakdown (see salary-report README): summing the
// two `additionalFixed*` values reproduces the old flat `additionalSalary`;
// summing the four bonus/occasional values reproduces the old `bonusSalary`.
// We keep the breakdown in the UI and answers.
export type SalaryComponentKey =
  | 'additionalFixedOvertime'
  | 'additionalFixedCarAllowance'
  | 'bonusOccasionalCarAllowance'
  | 'bonusOccasionalOvertime'
  | 'bonusPayments'
  | 'bonusOther'

// Employees are keyed by client-minted UUID (`id`) — `identifier` is a
// separate, human-facing pseudonym field the DMR API also returns (distinct
// from the draft's own `id`), not a join key.
export type Employee = {
  id: string
  ordinal: number
  identifier: string
  // Client-minted UUID of the role this employee is classified under
  // (`reportEmployeeRoleId` on the draft). Was `roleTitle`.
  roleId: string
  gender: string
  field?: string | null
  department?: string | null
  startDate: string
  workRatio: number
  baseSalary: number
  additionalFixedOvertime?: number | null
  additionalFixedCarAllowance?: number | null
  bonusOccasionalCarAllowance?: number | null
  bonusOccasionalOvertime?: number | null
  bonusPayments?: number | null
  bonusOther?: number | null
  // Outlier-group membership (client-minted UUID of the group, or null).
  outlierGroupId?: string | null
}

// Roles are keyed by client-minted UUID; only `stepIds` (job-factor step
// assignments) is editable on the "Flokkun starfa" screen, the rest is
// read-only context.
export type Role = {
  id: string
  title: string
  stepIds: string[]
}

// No `name` input in the UI yet (see salary-report README) — the API assigns
// a default server-side when it's omitted.
export type OutlierGroup = {
  id: string
  name?: string
  reason?: string
  action?: string
  signatureName?: string
  signatureRole?: string
  // Client-minted UUIDs of member employees, replacing the old ordinal list.
  employeeIds: string[]
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
}

// Moved from fields/JobClassificationEditor/utils.ts — shared by
// JobClassificationEditor and EmployeeClassificationEditor.

export type StepMeta = {
  steps: { order: number; score: number }[]
  totalSteps: number
  maxScore: number
  weight: number
  description: string
}

// A step assignment as displayed/edited on screen: grouped by criterion for
// the UI, but keyed by the sub-criterion's real id so the chosen stepOrder
// can be resolved back to a real step id at sync time (steps are their own
// id-keyed collection on the draft — the UI still lets the applicant pick
// "step 2 of 4" rather than a raw id).
export type DisplayAssignment = {
  criterionId: string
  criterionTitle: string
  subCriterionId: string
  subTitle: string
  stepOrder: number
}

export type AssignmentGroup = {
  criterionId: string
  criterionTitle: string
  items: { assignment: DisplayAssignment; index: number }[]
}
