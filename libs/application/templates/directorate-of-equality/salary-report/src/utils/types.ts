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
  // Parent criterion's client-minted UUID — the sync API's join key, not a title.
  criterionId: string
  title: string
  description?: string
  weight: string
  stepCount: string
  steps: SubCriterionStep[]
}

// Sync API keys step assignments by the step's own UUID; criterion/sub-criterion
// context for display is looked up elsewhere, not carried here.
export type StepAssignment = { stepId: string }

// Per-key breakdown (see README): the two additionalFixed* values sum to the
// old flat additionalSalary; the four bonus/occasional values sum to bonusSalary.
export type SalaryComponentKey =
  | 'additionalFixedOvertime'
  | 'additionalFixedCarAllowance'
  | 'bonusOccasionalCarAllowance'
  | 'bonusOccasionalOvertime'
  | 'bonusPayments'
  | 'bonusOther'

// id is the client-minted UUID key; identifier is a separate, human-facing
// pseudonym field from the DMR API, not a join key.
export type Employee = {
  id: string
  ordinal: number
  identifier: string
  // Role's client-minted UUID (was roleTitle).
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
  outlierGroupId?: string | null
}

// Roles are keyed by client-minted UUID; only stepIds is editable on the
// "Flokkun starfa" screen, the rest is read-only context.
export type Role = {
  id: string
  title: string
  stepIds: string[]
}

// No name input yet (see README) — API assigns a default server-side when omitted.
export type OutlierGroup = {
  id: string
  name?: string
  reason?: string
  action?: string
  signatureName?: string
  signatureRole?: string
  // Member employee ids (replaces the old ordinal list).
  employeeIds: string[]
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
}

// Moved from fields/JobClassificationEditor/utils.ts — shared by both classification editors.

export type StepMeta = {
  steps: { order: number; score: number }[]
  totalSteps: number
  maxScore: number
  weight: number
  description: string
}

// UI-facing shape: keeps stepOrder (e.g. "step 2 of 4") instead of a raw step
// id; resolved back to a real step id at sync time.
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
