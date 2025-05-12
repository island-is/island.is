import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { ApplicationRules, ApplicationRulesLimitations } from '../types'
import { isExemptionTypeShortTerm } from './getExemptionType'

export const getApplicationRules = (
  externalData: ExternalData,
): ApplicationRules | undefined => {
  const rules = getValueViaPath<ApplicationRules>(
    externalData,
    'applicationRules.data',
  )
  return rules
}

export const getApplicationRulesLimitations = (
  externalData: ExternalData,
  answers: FormValue,
): ApplicationRulesLimitations | undefined => {
  const rules = getApplicationRules(externalData)
  return isExemptionTypeShortTerm(answers)
    ? rules?.shortTermMeasurementLimitations
    : rules?.longTermMeasurementLimitations
}
