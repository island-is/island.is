import type { CalculatorContract } from '../../types/calculator'
import type { CalculatorField } from '../../types/input-field'
import type { CalculatorOutputField } from '../../types/output-field'

export const PAYMENT_FREQUENCIES = ['weekly', 'monthly'] as const
export type PaymentFrequency = (typeof PAYMENT_FREQUENCIES)[number]

export const MARITAL_STATUSES = [
  'single',
  'singleParent',
  'marriedOrCohabiting',
] as const
export type MaritalStatus = (typeof MARITAL_STATUSES)[number]

/* The mandatory pension contribution is all-or-nothing at 4%; the private
 * one is offered in whole points up to 4. */
export const PENSION_FUND_RATIOS = ['0%', '4%'] as const
export type PensionFundRatio = (typeof PENSION_FUND_RATIOS)[number]

export const PRIVATE_PENSION_RATIOS = ['0%', '1%', '2%', '3%', '4%'] as const
export type PrivatePensionRatio = (typeof PRIVATE_PENSION_RATIOS)[number]

/* The employer's match is negotiated per collective agreement, so the set is
 * neither round nor contiguous — 11% is genuinely absent between 10.5 and
 * 11.5. */
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
  (typeof EMPLOYER_PENSION_MATCH_RATIOS)[number]

const toOptions = (values: readonly string[]) =>
  values.map((value) => ({ value }))

/* Every field is optional, matching RSK: `GetWithholdingTaxData.query` is
 * itself optional and so is every member of it. A bare call returns RSK's own
 * defaults. Which fields a form treats as mandatory is a downstream concern. */
const withholdingTaxInputFields = [
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
  { name: 'incomeYear', type: 'number', required: true, semantic: 'year' },
  { name: 'payMonth', type: 'number', required: true, semantic: 'month' },
  { name: 'salary', type: 'number', required: true, semantic: 'currency' },
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
] as const satisfies readonly CalculatorField[]

const withholdingTaxOutputFields = [
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
] as const satisfies readonly CalculatorOutputField[]

export const withholdingTaxCalculator = {
  key: 'withholdingTax',
  inputFields: withholdingTaxInputFields,
  outputFields: withholdingTaxOutputFields,
} as const satisfies CalculatorContract<'withholdingTax'>

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
