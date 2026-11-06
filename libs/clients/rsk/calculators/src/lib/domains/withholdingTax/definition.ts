import type { GetWithholdingTaxData } from '../../../../gen/fetch'
import { HjuskaparstadaStadgreidsla, LaunGreidast } from '../../../../gen/fetch'
import {
  defineCalculator,
  defineInputFields,
  defineOutputFields,
  enumOptions,
} from '../../types/define'

const withholdingTaxInputFields = defineInputFields([
  {
    name: 'launGreidast',
    type: 'select',
    required: true,
    options: enumOptions(LaunGreidast),
  },
  {
    name: 'hjuskaparstada',
    type: 'select',
    required: true,
    options: enumOptions(HjuskaparstadaStadgreidsla),
  },
  { name: 'tekjuar', type: 'number', required: true, semantic: 'year' },
  { name: 'launamanudur', type: 'number', required: true, semantic: 'month' },
  { name: 'laun', type: 'number', required: true, semantic: 'currency' },
  {
    name: 'lifeyrissjodurHlutfall',
    type: 'number',
    required: true,
    semantic: 'percentage',
  },
  {
    name: 'sereignHlutfall',
    type: 'number',
    required: true,
    semantic: 'percentage',
  },
  {
    name: 'nytingSkattkorts',
    type: 'number',
    required: true,
    semantic: 'percentage',
  },
  {
    name: 'nytingSkattkortsMaka',
    type: 'number',
    required: true,
    semantic: 'percentage',
  },
  {
    name: 'uppsafnadurPersonuafslattur',
    type: 'number',
    required: true,
    semantic: 'currency',
  },
  { name: 'orlof', type: 'number', required: true, semantic: 'currency' },
  {
    name: 'stettarfelag',
    type: 'number',
    required: true,
    semantic: 'currency',
  },
  { name: 'annad', type: 'number', required: true, semantic: 'currency' },
  {
    name: 'motframlagLifeyrissjodur',
    type: 'number',
    required: true,
    semantic: 'percentage',
  },
  {
    name: 'okutaekjastyrkurUtan',
    type: 'number',
    required: true,
    semantic: 'currency',
  },
  {
    name: 'idgjaldSlysatryggingSjomanna',
    type: 'number',
    required: true,
    semantic: 'currency',
  },
] as const)

const withholdingTaxOutputFields = defineOutputFields([
  {
    name: 'monthlySalary',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'appliedPensionFundRatio',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'appliedPrivatePensionRatio',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'pensionFundPayment',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'privatePensionPayment',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'totalDeductions',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'personalTaxCredit',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'spousePersonalTaxCredit',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'taxBase', kind: 'scalar', type: 'number', semantic: 'currency' },
  {
    name: 'calculatedWithholding',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'paidWithholding',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'highIncomeTax',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'highIncomeTaxApplied', kind: 'scalar', type: 'boolean' },
  {
    name: 'salaryAfterDeductions',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'accumulatedPersonalTaxCredit',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'incomeYear', kind: 'scalar', type: 'number', semantic: 'year' },
  { name: 'maritalStatusCode', kind: 'scalar', type: 'number' },
  { name: 'payMonth', kind: 'scalar', type: 'number', semantic: 'month' },
  {
    name: 'childIncomeLimit',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'childBirthYear', kind: 'scalar', type: 'number', semantic: 'year' },
  {
    name: 'withholdingRate',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'employerPensionMatch',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'payrollTaxBase',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'payrollTax', kind: 'scalar', type: 'number', semantic: 'currency' },
  {
    name: 'taxBrackets',
    kind: 'array',
    itemFields: [
      {
        name: 'lowerBound',
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      { name: 'bracketNumber', kind: 'scalar', type: 'number' },
      {
        name: 'withholdingRate',
        kind: 'scalar',
        type: 'number',
        semantic: 'percentage',
      },
      {
        name: 'calculatedWithholding',
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
    ],
  },
] as const)

export const withholdingTaxCalculator = defineCalculator({
  key: 'withholdingTax',
  inputFields: withholdingTaxInputFields,
  outputFields: withholdingTaxOutputFields,
} as const)

export type WithholdingTaxInput = GetWithholdingTaxData['query']

export interface WithholdingTaxBracketOutput {
  lowerBound?: number
  bracketNumber?: number
  withholdingRate?: number
  calculatedWithholding?: number
}

export interface WithholdingTaxOutput {
  monthlySalary?: number
  appliedPensionFundRatio?: number
  appliedPrivatePensionRatio?: number
  pensionFundPayment?: number
  privatePensionPayment?: number
  totalDeductions?: number
  personalTaxCredit?: number
  spousePersonalTaxCredit?: number
  taxBase?: number
  calculatedWithholding?: number
  paidWithholding?: number
  highIncomeTax?: number
  highIncomeTaxApplied?: boolean
  salaryAfterDeductions?: number
  accumulatedPersonalTaxCredit?: number
  incomeYear?: number
  maritalStatusCode?: number
  payMonth?: number
  childIncomeLimit?: number
  childBirthYear?: number
  withholdingRate?: number
  employerPensionMatch?: number
  payrollTaxBase?: number
  payrollTax?: number
  taxBrackets: WithholdingTaxBracketOutput[]
}
