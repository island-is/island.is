import { IntlShape } from 'react-intl'

import {
  IndictmentCountOffense,
  Substance,
  SubstanceMap,
} from '@island.is/judicial-system/types'
import { Offense } from '@island.is/judicial-system-web/src/graphql/schema'

import { indictmentCount as strings } from '../IndictmentCount.strings'
import { indictmentCountSubstanceEnum as substanceStrings } from '../IndictmentCountSubstanceEnum.strings'

export const getIncidentDescriptionReason = (
  offenses: Offense[],
  formatMessage: IntlShape['formatMessage'],
) => {
  const order = [
    IndictmentCountOffense.DRUNK_DRIVING,
    IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING,
    IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING,
  ]

  let reason = offenses
    .filter(
      (o) =>
        o.offense !== IndictmentCountOffense.SPEEDING &&
        o.offense !== IndictmentCountOffense.OTHER,
    )
    .sort((a, b) => order.indexOf(a.offense) - order.indexOf(b.offense))
    .reduce((acc, o, index) => {
      if (
        (offenses.length > 1 && index === offenses.length - 1) ||
        (offenses.length > 2 &&
          index === offenses.length - 2 &&
          o.offense === IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING)
      ) {
        acc += ' og '
      } else if (index > 0) {
        acc += ', '
      }
      switch (o.offense) {
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
            (offenses.some(
              (o) => o.offense === IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING,
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

  const substances = offenses
    .filter((o) => o.substances)
    .flatMap(({ substances }) => Object.entries(substances as SubstanceMap))
  reason += substances.reduce((acc, substance, index) => {
    if (index === 0) {
      acc += ` (${formatMessage(
        strings.incidentDescriptionSubstancesPrefixAutofill,
      )} `
    } else if (index === substances.length - 1) {
      acc += ' og '
    } else {
      acc += ', '
    }
    acc += formatMessage(substanceStrings[substance[0] as Substance], {
      amount: substance[1],
    })
    if (index === substances.length - 1) {
      acc += ')'
    }
    return acc
  }, '')

  return reason
}
