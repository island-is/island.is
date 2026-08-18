import type {
  ParsedEmployeeDto,
  ParsedRoleDto,
} from '@island.is/clients/directorate-of-equality'

// Not exported from the client's public API — derived from its one usage site.
type ParsedStepAssignmentDto = ParsedRoleDto['stepAssignments'][number]

export type JobFactor = {
  type: string
  title: string
  description: string
  weight: string
}

export type PersonalFactor = {
  title: string
  description?: string
  weight: string
}

export type SubCriterionStep = {
  description: string
}

export type SubCriterion = {
  title: string
  description?: string
  weight: string
  stepCount: string
  steps: SubCriterionStep[]
}

export type EmployeeStepAssignment = ParsedStepAssignmentDto
export type StepAssignment = ParsedStepAssignmentDto

// The API broke the flat `additionalSalary` / `bonusSalary` fields into these
// components. Summing the two `additionalFixed*` values reproduces the old
// additional salary; summing the four bonus/occasional values reproduces the
// old bonus salary. We keep the breakdown in the UI and answers.
export type SalaryComponentKey =
  | 'additionalFixedOvertime'
  | 'additionalFixedCarAllowance'
  | 'bonusOccasionalCarAllowance'
  | 'bonusOccasionalOvertime'
  | 'bonusPayments'
  | 'bonusOther'

// Based on ParsedEmployeeDto from @island.is/clients/directorate-of-equality,
// minus `education` (unused, see salary-report README), with `field`/
// `department` relaxed to optional/nullable (genuinely optional — the API
// returns null for an empty cell, the form leaves it ''), and
// `gender` widened to `string` (the form allows an unanswered '' draft state
// before the API's stricter union applies). The full object is stored in
// answers so the complete record is available at submission, even though
// only a subset is shown on screen.
export type Employee = Omit<
  ParsedEmployeeDto,
  'education' | 'field' | 'department' | 'gender'
> & {
  gender: string
  field?: string | null
  department?: string | null
}

// Based on ParsedRoleDto. Only stepOrder is editable on the "Flokkun starfa"
// screen; the rest is read-only context.
export type Role = ParsedRoleDto

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
}
