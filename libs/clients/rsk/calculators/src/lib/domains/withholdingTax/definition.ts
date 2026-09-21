import {
  defineCalculator,
  defineInputFields,
  defineOutputFields,
} from '../../types/define'

export const PAYMENT_FREQUENCIES = ['weekly', 'monthly'] as const
export type PaymentFrequency = typeof PAYMENT_FREQUENCIES[number]

export const MARITAL_STATUSES = [
  'single',
  'singleParent',
  'marriedOrCohabiting',
] as const
export type MaritalStatus = typeof MARITAL_STATUSES[number]

export const PENSION_FUND_RATIOS = ['0%', '4%'] as const
export type PensionFundRatio = typeof PENSION_FUND_RATIOS[number]

export const PRIVATE_PENSION_RATIOS = ['0%', '1%', '2%', '3%', '4%'] as const
export type PrivatePensionRatio = typeof PRIVATE_PENSION_RATIOS[number]

// Deliberately excludes 11%; these rates are negotiated.
export const EMPLOYER_PENSION_MATCH_RATIOS = [
  '0%',
  '8%',
  '8.5%',
  '10%',
  '10.5%',
  '11.5%',
  '12%',
  '13.5%',
] as const
export type EmployerPensionMatchRatio =
  typeof EMPLOYER_PENSION_MATCH_RATIOS[number]

const toOptions = (values: readonly string[]) =>
  values.map((value) => ({ value }))

const withholdingTaxInputFields = defineInputFields([
  {
    name: 'paymentFrequency',
    type: 'select',
    required: false,
    options: toOptions(PAYMENT_FREQUENCIES),
  },
  {
    name: 'maritalStatus',
    type: 'select',
    required: false,
    options: toOptions(MARITAL_STATUSES),
  },
  { name: 'incomeYear', type: 'number', required: false, semantic: 'year' },
  { name: 'payMonth', type: 'number', required: false, semantic: 'month' },
  { name: 'salary', type: 'number', required: false, semantic: 'currency' },
  {
    name: 'pensionFundRatio',
    type: 'select',
    required: false,
    options: toOptions(PENSION_FUND_RATIOS),
  },
  {
    name: 'privatePensionRatio',
    type: 'select',
    required: false,
    options: toOptions(PRIVATE_PENSION_RATIOS),
  },
  {
    name: 'taxCardUtilization',
    type: 'number',
    required: false,
    semantic: 'percentage',
  },
  {
    name: 'spouseTaxCardUtilization',
    type: 'number',
    required: false,
    semantic: 'percentage',
  },
  {
    name: 'accumulatedPersonalTaxCredit',
    type: 'number',
    required: false,
    semantic: 'currency',
  },
  {
    name: 'vacationPay',
    type: 'number',
    required: false,
    semantic: 'currency',
  },
  { name: 'unionDues', type: 'number', required: false, semantic: 'currency' },
  {
    name: 'otherDeduction',
    type: 'number',
    required: false,
    semantic: 'currency',
  },
  {
    name: 'employerPensionMatchRatio',
    type: 'select',
    required: false,
    options: toOptions(EMPLOYER_PENSION_MATCH_RATIOS),
  },
  {
    name: 'vehicleAllowance',
    type: 'number',
    required: false,
    semantic: 'currency',
  },
  {
    name: 'seamenAccidentInsurancePremium',
    type: 'number',
    required: false,
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

export interface WithholdingTaxInput {
  paymentFrequency?: PaymentFrequency
  maritalStatus?: MaritalStatus
  incomeYear?: number
  payMonth?: number
  salary?: number
  pensionFundRatio?: PensionFundRatio
  privatePensionRatio?: PrivatePensionRatio
  taxCardUtilization?: number
  spouseTaxCardUtilization?: number
  accumulatedPersonalTaxCredit?: number
  vacationPay?: number
  unionDues?: number
  otherDeduction?: number
  employerPensionMatchRatio?: EmployerPensionMatchRatio
  vehicleAllowance?: number
  seamenAccidentInsurancePremium?: number
}

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
