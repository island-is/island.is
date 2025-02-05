import { IntlShape } from 'react-intl'

import {
  formatDate,
  indictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { CrimeScene, IndictmentSubtype } from '@island.is/judicial-system/types'
import { IndictmentCountOffense } from '@island.is/judicial-system-web/src/graphql/schema'
import { TempIndictmentCount } from '@island.is/judicial-system-web/src/types'
import { isTrafficViolationIndictmentCount } from '@island.is/judicial-system-web/src/utils/formHelper'

import { getDeprecatedIncidentDescriptionReason } from './getDeprecatedIncidentDescriptionReason'
import { getIncidentDescriptionReason } from './getIncidentDescriptionReason'
import { indictmentCount as strings } from '../IndictmentCount.strings'

export const getIncidentDescription = (
  indictmentCount: TempIndictmentCount,
  formatMessage: IntlShape['formatMessage'],
  crimeScene?: CrimeScene,
  subtypesRecord?: Record<string, IndictmentSubtype[]>,
  isOffenseEndpointEnabled?: boolean,
) => {
  const {
    offenses,
    deprecatedOffenses,
    substances,
    vehicleRegistrationNumber,
    indictmentCountSubtypes,
    policeCaseNumber,
  } = indictmentCount

  const incidentLocation = crimeScene?.place || '[Vettvangur]'
  const incidentDate = crimeScene?.date
    ? formatDate(crimeScene.date, 'PPPP')?.replace('dagur,', 'daginn') || ''
    : '[Dagsetning]'

  const vehicleRegistration =
    vehicleRegistrationNumber || '[Skráningarnúmer ökutækis]'

  const subtypes =
    (subtypesRecord && policeCaseNumber && subtypesRecord[policeCaseNumber]) ||
    []

  if (
    subtypes.length === 0 ||
    (subtypes.length > 1 &&
      (!indictmentCountSubtypes?.length ||
        indictmentCountSubtypes.length === 0))
  ) {
    return ''
  }

  if (
    isTrafficViolationIndictmentCount(policeCaseNumber, subtypesRecord) ||
    indictmentCountSubtypes?.includes(IndictmentSubtype.TRAFFIC_VIOLATION)
  ) {
    if (!deprecatedOffenses || deprecatedOffenses.length === 0) {
      return ''
    }

    const { reason, isSpeeding } = isOffenseEndpointEnabled
      ? {
          reason: getIncidentDescriptionReason(offenses || [], formatMessage),
          isSpeeding: indictmentCount.offenses?.some(
            (o) => o.offense === IndictmentCountOffense.SPEEDING,
          ),
        }
      : {
          reason: getDeprecatedIncidentDescriptionReason(
            deprecatedOffenses,
            substances || {},
            formatMessage,
          ),
          isSpeeding: indictmentCount.deprecatedOffenses?.includes(
            IndictmentCountOffense.SPEEDING,
          ),
        }

    const recordedSpeed = indictmentCount.recordedSpeed ?? '[Mældur hraði]'
    const speedLimit = indictmentCount.speedLimit ?? '[Leyfilegur hraði]'

    return formatMessage(strings.incidentDescriptionAutofill, {
      incidentDate,
      vehicleRegistrationNumber: vehicleRegistration,
      reason,
      incidentLocation,
      isSpeeding,
      recordedSpeed,
      speedLimit,
    })
  }

  if (subtypes.length === 1) {
    return formatMessage(strings.indictmentDescriptionSubtypesAutofill, {
      subtypes: indictmentSubtypes[subtypes[0]],
      date: incidentDate,
    })
  }

  const allSubtypes = indictmentCountSubtypes
    ?.map((subtype) => indictmentSubtypes[subtype])
    .join(', ')

  return formatMessage(strings.indictmentDescriptionSubtypesAutofill, {
    subtypes: allSubtypes,
    date: incidentDate,
  })
}
