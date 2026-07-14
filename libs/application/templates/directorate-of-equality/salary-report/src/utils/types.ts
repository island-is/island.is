export type JobFactor = {
  type: string
  title: string
  description: string
  weight: string
}

export type PersonalFactor = {
  title: string
  description: string
  weight: string
}

export type SubCriterionStep = {
  description: string
}

export type SubCriterion = {
  title: string
  description: string
  weight: string
  stepCount: string
  steps: SubCriterionStep[]
}

export type EmployeeStepAssignment = {
  subTitle: string
  stepOrder: number
  criterionTitle: string
}

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

// Mirrors ParsedEmployeeDto from @island.is/clients/directorate-of-equality.
// The full object is stored in answers so the complete record is available at
// submission, even though only a subset is shown on screen.
export type Employee = {
  ordinal: number
  identifier: string
  roleTitle: string
  education: string
  gender: string
  field: string
  department: string
  startDate: string
  workRatio: number
  baseSalary: number
  personalStepAssignments: EmployeeStepAssignment[]
} & { [K in SalaryComponentKey]?: number | null }

export type StepAssignment = {
  criterionTitle: string
  subTitle: string
  stepOrder: number
}

// Mirrors ParsedRoleDto. Only stepOrder is editable on the "Flokkun starfa"
// screen; the rest is read-only context.
export type Role = {
  title: string
  stepAssignments: StepAssignment[]
}

export enum ChiefExecutiveGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
}
