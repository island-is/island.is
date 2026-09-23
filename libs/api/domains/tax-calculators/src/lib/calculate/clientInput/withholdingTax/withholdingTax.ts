import {
  EMPLOYER_PENSION_MATCH_RATIOS,
  MARITAL_STATUSES,
  PAYMENT_FREQUENCIES,
  PENSION_FUND_RATIOS,
  PRIVATE_PENSION_RATIOS,
} from '@island.is/clients/rsk/calculators'
import type { WithholdingTaxInput } from '@island.is/clients/rsk/calculators'

import type { SubmittedValues } from '../../submission/submission'
import { numberAt, optionAt } from '../validation'

/* All fields are optional; upstream defaults fill missing values. */
export const toWithholdingTaxInput = (
  values: SubmittedValues,
): WithholdingTaxInput => ({
  paymentFrequency: optionAt(values, 'paymentFrequency', PAYMENT_FREQUENCIES),
  maritalStatus: optionAt(values, 'maritalStatus', MARITAL_STATUSES),
  incomeYear: numberAt(values, 'incomeYear'),
  payMonth: numberAt(values, 'payMonth'),
  salary: numberAt(values, 'salary'),
  pensionFundRatio: optionAt(values, 'pensionFundRatio', PENSION_FUND_RATIOS),
  privatePensionRatio: optionAt(
    values,
    'privatePensionRatio',
    PRIVATE_PENSION_RATIOS,
  ),
  taxCardUtilization: numberAt(values, 'taxCardUtilization'),
  spouseTaxCardUtilization: numberAt(values, 'spouseTaxCardUtilization'),
  accumulatedPersonalTaxCredit: numberAt(
    values,
    'accumulatedPersonalTaxCredit',
  ),
  vacationPay: numberAt(values, 'vacationPay'),
  unionDues: numberAt(values, 'unionDues'),
  otherDeduction: numberAt(values, 'otherDeduction'),
  employerPensionMatchRatio: optionAt(
    values,
    'employerPensionMatchRatio',
    EMPLOYER_PENSION_MATCH_RATIOS,
  ),
  vehicleAllowance: numberAt(values, 'vehicleAllowance'),
  seamenAccidentInsurancePremium: numberAt(
    values,
    'seamenAccidentInsurancePremium',
  ),
})
