import type { CalculatorContract, CalculatorField } from '../../contracts/field'
import type { CalculatorOutputField } from '../../contracts/output'

const childBenefitInputFields = [
  { name: 'marriedOrCohabiting', type: 'boolean', required: true },
  { name: 'incomeYear', type: 'number', required: true, semantic: 'year' },
  { name: 'incomeBase', type: 'number', required: true, semantic: 'currency' },
  {
    name: 'numberOfChildren',
    type: 'number',
    required: true,
    semantic: 'count',
  },
  {
    name: 'numberOfChildrenUnder7',
    type: 'number',
    required: true,
    semantic: 'count',
  },
  { name: 'splitCustody', type: 'boolean', required: true },
  {
    name: 'splitCustodyChildrenOver7',
    type: 'number',
    required: false,
    semantic: 'count',
    dependsOn: { field: 'splitCustody', equals: true },
  },
  {
    name: 'splitCustodyChildrenUnder7',
    type: 'number',
    required: false,
    semantic: 'count',
    dependsOn: { field: 'splitCustody', equals: true },
  },
] as const satisfies readonly CalculatorField[]

const childBenefitOutputFields = [
  { name: 'maritalStatusLabel', kind: 'scalar', type: 'string' },
  {
    name: 'numberOfChildren',
    kind: 'scalar',
    type: 'number',
    semantic: 'count',
  },
  {
    name: 'numberOfChildrenUnder7',
    kind: 'scalar',
    type: 'number',
    semantic: 'count',
  },
  { name: 'incomeYear', kind: 'scalar', type: 'number', semantic: 'year' },
  { name: 'benefitYear', kind: 'scalar', type: 'number', semantic: 'year' },
  { name: 'incomeBase', kind: 'scalar', type: 'number', semantic: 'currency' },
  {
    name: 'reductionRate',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'reductionThreshold',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'upperReductionThreshold',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'reductionBase',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'excessReductionBase',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'incomeReduction',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'excessIncomeReduction',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'excessReductionRate',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'unreducedChildBenefit',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'childBenefitPerChild',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'totalChildBenefit',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'quarterlyPayments',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'incomeRelatedChildBenefit',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'totalChildBenefitPerCouple',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'additionalBenefitForChildrenUnder7',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'additionalBenefitPerChildUnder7',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'reductionForChildrenUnder7',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'reductionRateForChildrenUnder7',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  { name: 'childrenBirthYears', kind: 'scalar', type: 'string' },
  { name: 'splitCustody', kind: 'scalar', type: 'boolean' },
  {
    name: 'splitCustodyChildrenOver7',
    kind: 'scalar',
    type: 'number',
    semantic: 'count',
  },
  {
    name: 'splitCustodyChildrenUnder7',
    kind: 'scalar',
    type: 'number',
    semantic: 'count',
  },
  {
    name: 'childBenefitBeforeSplit',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
] as const satisfies readonly CalculatorOutputField[]

export const childBenefitCalculator = {
  key: 'childBenefit',
  inputFields: childBenefitInputFields,
  outputFields: childBenefitOutputFields,
} as const satisfies CalculatorContract<'childBenefit'>

export interface ChildBenefitInput {
  marriedOrCohabiting: boolean
  incomeYear: number
  incomeBase: number
  numberOfChildren: number
  numberOfChildrenUnder7: number
  splitCustody: boolean
  splitCustodyChildrenOver7?: number
  splitCustodyChildrenUnder7?: number
}

export interface ChildBenefitOutput {
  maritalStatusLabel?: string
  numberOfChildren?: number
  numberOfChildrenUnder7?: number
  incomeYear?: number
  benefitYear?: number
  incomeBase?: number
  reductionRate?: number
  reductionThreshold?: number
  upperReductionThreshold?: number
  reductionBase?: number
  excessReductionBase?: number
  incomeReduction?: number
  excessIncomeReduction?: number
  excessReductionRate?: number
  unreducedChildBenefit?: number
  childBenefitPerChild?: number
  totalChildBenefit?: number
  quarterlyPayments?: number
  incomeRelatedChildBenefit?: number
  totalChildBenefitPerCouple?: number
  additionalBenefitForChildrenUnder7?: number
  additionalBenefitPerChildUnder7?: number
  reductionForChildrenUnder7?: number
  reductionRateForChildrenUnder7?: number
  childrenBirthYears?: string
  splitCustody?: boolean
  splitCustodyChildrenOver7?: number
  splitCustodyChildrenUnder7?: number
  childBenefitBeforeSplit?: number
}
