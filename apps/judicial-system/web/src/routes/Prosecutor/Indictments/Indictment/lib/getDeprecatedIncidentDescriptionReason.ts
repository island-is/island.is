import { IntlShape } from 'react-intl'

import {
  IndictmentCountOffense,
  Substance,
  SubstanceMap,
} from '@island.is/judicial-system/types'

import { getRelevantSubstances } from '../IndictmentCount'
import { indictmentCount as strings } from '../IndictmentCount.strings'
import { indictmentCountSubstanceEnum as substanceStrings } from '../IndictmentCountSubstanceEnum.strings'

export const getDeprecatedIncidentDescriptionReason = (
  deprecatedOffenses: IndictmentCountOffense[],
  substances: SubstanceMap,
  formatMessage: IntlShape['formatMessage'],
) => {
  let reason = deprecatedOffenses
    .filter((offense) => offense !== IndictmentCountOffense.SPEEDING)
    .reduce((acc, offense, index) => {
      if (
        (deprecatedOffenses.length > 1 &&
          index === deprecatedOffenses.length - 1) ||
        (deprecatedOffenses.length > 2 &&
          index === deprecatedOffenses.length - 2 &&
          offense === IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING)
      ) {
        acc += ' og '
      } else if (index > 0) {
        acc += ', '
      }
      switch (offense) {
        case IndictmentCountOffense.DRIVING_WITHOUT_LICENCE:
          acc += formatMessage(
            strings.incidentDescriptionDrivingWithoutLicenceAutofill,
          )
          break
        case IndictmentCountOffense.DRUNK_DRIVING:
          acc += formatMessage(strings.incidentDescriptionDrunkDrivingAutofill)
          break
        case IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING:
          acc += `${formatMessage(
            strings.incidentDescriptionDrugsDrivingPrefixAutofill,
          )} ${formatMessage(
            strings.incidentDescriptionIllegalDrugsDrivingAutofill,
          )}`
          break
        case IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING:
          acc +=
            (deprecatedOffenses.includes(
              IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING,
            )
              ? ''
              : `${formatMessage(
                  strings.incidentDescriptionDrugsDrivingPrefixAutofill,
                )} `) +
            formatMessage(
              strings.incidentDescriptionPrescriptionDrugsDrivingAutofill,
            )
          break
      }
      return acc
    }, '')

  const relevantSubstances = getRelevantSubstances(
    deprecatedOffenses,
    substances,
  )

  reason += relevantSubstances.reduce((acc, substance, index) => {
    if (index === 0) {
      acc += ` (${formatMessage(
        strings.incidentDescriptionSubstancesPrefixAutofill,
      )} `
    } else if (index === relevantSubstances.length - 1) {
      acc += ' og '
    } else {
      acc += ', '
    }
    acc += formatMessage(substanceStrings[substance[0] as Substance], {
      amount: substance[1],
    })
    if (index === relevantSubstances.length - 1) {
      acc += ')'
    }
    return acc
  }, '')

  return reason
}
