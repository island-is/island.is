import type { CalculatorContract, CalculatorField } from '../../contracts/field'
import type { CalculatorOutputField } from '../../contracts/output'

const interestBenefitInputFields = [
  {
    name: 'maritalStatus',
    type: 'select',
    required: true,
    options: [
      { value: 'single' },
      { value: 'singleParent' },
      { value: 'marriedOrCohabiting' },
    ],
  },
  { name: 'incomeYear', type: 'number', required: true, semantic: 'year' },
  { name: 'incomeBase', type: 'number', required: true, semantic: 'currency' },
  { name: 'assetBase', type: 'number', required: true, semantic: 'currency' },
  { name: 'loanBalance', type: 'number', required: true, semantic: 'currency' },
  {
    name: 'paidInterest',
    type: 'number',
    required: true,
    semantic: 'currency',
  },
] as const satisfies readonly CalculatorField[]

const interestBenefitOutputFields = [
  { name: 'maritalStatusLabel', kind: 'scalar', type: 'string' },
  { name: 'incomeYear', kind: 'scalar', type: 'number', semantic: 'year' },
  { name: 'benefitYear', kind: 'scalar', type: 'number', semantic: 'year' },
  {
    name: 'maximumInterestExpenses',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'interestExpensesForCalculation',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'incomeBase', kind: 'scalar', type: 'number', semantic: 'currency' },
  { name: 'assetBase', kind: 'scalar', type: 'number', semantic: 'currency' },
  { name: 'loanBalance', kind: 'scalar', type: 'number', semantic: 'currency' },
  {
    name: 'interestExpenses',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'maximumInterestBenefit',
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
    name: 'interestBenefitAfterIncomeReduction',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'incomeReductionRate',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'debtReductionRate',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'assetReduction',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'assetReductionRate',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'reductionLaw2003',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'reductionLaw2004',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'totalInterestBenefit',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'specialInterestReimbursement',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'reachedMaximum', kind: 'scalar', type: 'boolean' },
  { name: 'wasBelowMinimum', kind: 'scalar', type: 'boolean' },
] as const satisfies readonly CalculatorOutputField[]

export const interestBenefitCalculator = {
  key: 'interestBenefit',
  inputFields: interestBenefitInputFields,
  outputFields: interestBenefitOutputFields,
} as const satisfies CalculatorContract<'interestBenefit'>

export interface InterestBenefitInput {
  maritalStatus: 'single' | 'singleParent' | 'marriedOrCohabiting'
  incomeYear: number
  incomeBase: number
  assetBase: number
  loanBalance: number
  paidInterest: number
}

export interface InterestBenefitOutput {
  maritalStatusLabel?: string
  incomeYear?: number
  benefitYear?: number
  maximumInterestExpenses?: number
  interestExpensesForCalculation?: number
  incomeBase?: number
  assetBase?: number
  loanBalance?: number
  interestExpenses?: number
  maximumInterestBenefit?: number
  incomeReduction?: number
  interestBenefitAfterIncomeReduction?: number
  incomeReductionRate?: number
  debtReductionRate?: number
  assetReduction?: number
  assetReductionRate?: number
  reductionLaw2003?: number
  reductionLaw2004?: number
  totalInterestBenefit?: number
  specialInterestReimbursement?: number
  reachedMaximum?: boolean
  wasBelowMinimum?: boolean
}
