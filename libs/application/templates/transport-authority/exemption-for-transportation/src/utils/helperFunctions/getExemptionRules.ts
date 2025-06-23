import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { checkIfExemptionTypeShortTerm } from './getExemptionType'
import {
  ExemptionRules,
  ExemptionRulesLimitations,
} from '@island.is/clients/transport-authority/exemption-for-transportation'

export const getExemptionRules = (
  externalData: ExternalData,
): ExemptionRules | undefined => {
  const rules = getValueViaPath<ExemptionRules>(
    externalData,
    'exemptionRules.data',
  )
  return rules
}

export const getExemptionRulesLimitations = (
  externalData: ExternalData,
  answers: FormValue,
): ExemptionRulesLimitations | undefined => {
  const rules = getExemptionRules(externalData)
  return checkIfExemptionTypeShortTerm(answers)
    ? rules?.shortTermMeasurementLimitations
    : rules?.longTermMeasurementLimitations
}
