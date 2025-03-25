import { IntlShape } from 'react-intl'

import {
  formatDate,
  indictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { CrimeScene, IndictmentSubtype } from '@island.is/judicial-system/types'
import {
  IndictmentCount,
  IndictmentCountOffense,
  Maybe,
  Offense,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isTrafficViolationIndictmentCount } from '@island.is/judicial-system-web/src/utils/formHelper'

import { getIncidentDescriptionReason } from './getIncidentDescriptionReason'
import { indictmentCount as strings } from '../IndictmentCount.strings'

const getIncidentDescriptionProps = ({
  offenses,
  formatMessage,
}: {
  offenses?: Maybe<Offense[]>
  formatMessage: IntlShape['formatMessage']
}) => {
  if (!offenses || offenses.length === 0) {
    return undefined
  }
  const reason = getIncidentDescriptionReason(offenses || [], formatMessage)
  const isSpeeding = offenses?.some(
    (o) => o.offense === IndictmentCountOffense.SPEEDING,
  )
  return { reason, isSpeeding }
}

export const getIncidentDescription = ({
  indictmentCount,
  formatMessage,
  crimeScene,
  subtypesRecord,
}: {
  indictmentCount: IndictmentCount
  formatMessage: IntlShape['formatMessage']
  crimeScene?: CrimeScene
  subtypesRecord?: Record<string, IndictmentSubtype[]>
}) => {
  const {
    offenses,
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
    const hasOnlyOtherOffense =
      offenses?.length === 1 &&
      offenses[0].offense === IndictmentCountOffense.OTHER

    if (hasOnlyOtherOffense) {
      return formatMessage(strings.incidentDescriptionShortAutofill, {
        incidentDate,
      })
    }

    const incidentDescriptionProps = getIncidentDescriptionProps({
      offenses,
      formatMessage,
    })
    if (!incidentDescriptionProps) {
      return ''
    }

    const { reason, isSpeeding } = incidentDescriptionProps
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
