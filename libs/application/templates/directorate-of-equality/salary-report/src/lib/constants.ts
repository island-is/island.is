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

export const DEFAULT_JOB_FACTORS: JobFactor[] = [
  {
    type: 'RESPONSIBILITY',
    title: 'Ábyrgð',
    description:
      'Metur ábyrgð starfsins á fólki, fjármálum, gæðum og öðrum þáttum.',
    weight: '25',
  },
  {
    type: 'STRAIN',
    title: 'Álag',
    description: 'Metur hraða, tímaþrýsting, líkamlegt og tilfinningalegt álag.',
    weight: '25',
  },
  {
    type: 'CONDITION',
    title: 'Vinnuaðstæður',
    description:
      'Metur vaktavinnu, ferðalög, áhættu og aðrar aðstæður starfsins.',
    weight: '25',
  },
  {
    type: 'COMPETENCE',
    title: 'Hæfni',
    description:
      'Metur menntunarkröfur, reynslukröfur og sérhæfingu starfsins.',
    weight: '25',
  },
]

export const DEFAULT_CRITERIA_ANSWERS = {
  jobFactors: DEFAULT_JOB_FACTORS,
  personalFactors: [] as PersonalFactor[],
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

export const DEFAULT_SUB_CRITERION: SubCriterion = {
  title: '',
  description: '',
  weight: '',
  stepCount: '2',
  steps: [{ description: '' }, { description: '' }],
}

export type EmployeeStepAssignment = {
  subTitle: string
  stepOrder: number
  criterionTitle: string
}

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
  additionalSalary: number
  bonusSalary?: number | null
  personalStepAssignments: EmployeeStepAssignment[]
}

// NOTE: Icelandic labels below are best-guess mappings of the API enums —
// adjust wording as needed.
export const GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: 'FEMALE', label: 'Kona' },
  { value: 'MALE', label: 'Karl' },
  { value: 'NEUTRAL', label: 'Kynsegin/annað' },
]

export const EDUCATION_OPTIONS: { value: string; label: string }[] = [
  { value: 'COMPULSORY', label: 'Grunnskólapróf' },
  { value: 'UPPER_SECONDARY', label: 'Framhaldsskólapróf' },
  { value: 'VOCATIONAL', label: 'Iðnmenntun' },
  { value: 'BACHELOR', label: 'Háskólamenntun' },
  { value: 'MASTER', label: 'Meistaragráða' },
  { value: 'DOCTORATE', label: 'Doktorsgráða' },
  { value: 'PROFESSIONAL', label: 'Starfsréttindi' },
]

export const GENDER_LABELS: Record<string, string> = Object.fromEntries(
  GENDER_OPTIONS.map((o) => [o.value, o.label]),
)

export const EDUCATION_LABELS: Record<string, string> = Object.fromEntries(
  EDUCATION_OPTIONS.map((o) => [o.value, o.label]),
)

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

export const EMPTY_EMPLOYEE: Employee = {
  ordinal: 0,
  identifier: '',
  roleTitle: '',
  education: '',
  gender: '',
  field: '',
  department: '',
  startDate: '',
  workRatio: 1,
  baseSalary: 0,
  additionalSalary: 0,
  bonusSalary: 0,
  personalStepAssignments: [],
}
