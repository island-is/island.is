import React from 'react'
import { Duration } from '@island.is/application/templates/family-matters-core/fields'
import { duration } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'

const typeInput = 'selectDuration.type'
const dateInput = 'selectDuration.date'

export const selectDurationInputs = [typeInput, dateInput]

const CRCDuration = ({ application, errors }: CRCFieldBaseProps) => {
  const durationTypeError = errors?.selectDuration?.type
  const durationDateError = errors?.selectDuration?.date

  return (
    <Duration
      typeInput={{ id: typeInput, error: durationTypeError }}
      dateInput={{ id: dateInput, error: durationDateError }}
      translations={duration}
      currentAnswer={application.answers?.selectDuration?.type}
    />
  )
}

export default CRCDuration
