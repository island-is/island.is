import React, { FC, useMemo } from 'react'
import parseISO from 'date-fns/parseISO'
import { useFormContext } from 'react-hook-form'

import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { AlertMessage, Box } from '@island.is/island-ui/core'

import { calculateMaxPercentageForPeriod } from '../../lib/directorateOfLabour.utils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'
import { useRemainingRights } from '../../hooks/useRemainingRights'

export const PeriodRatioWarning: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const { watch } = useFormContext()
  const { rawPeriods } = getApplicationAnswers(application.answers)
  const currentIndex = (() => {
    const id = typeof field.id === 'string' ? field.id : ''
    const match = id.match(/\[(\d+)\]/)
    return match ? parseInt(match[1], 10) : -1
  })()
  const currentPeriod = rawPeriods[currentIndex]

  const watchedStartDate = watch(`periods[${currentIndex}].startDate`)
  const watchedEndDate = watch(`periods[${currentIndex}].endDate`)
  const startDate = watchedStartDate || currentPeriod?.startDate
  const endDate = watchedEndDate || currentPeriod?.endDate

  const remainingRights = useRemainingRights(application)

  const maxPercentageBelow100 = useMemo(() => {
    if (!startDate || !endDate) return false
    const start = parseISO(startDate)
    const end = parseISO(endDate)
    const rawMax = calculateMaxPercentageForPeriod(start, end, remainingRights)
    return rawMax !== null && Math.round(rawMax * 100) < 100
  }, [startDate, endDate, remainingRights])

  if (!maxPercentageBelow100) return null

  return (
    <Box marginTop={2}>
      <AlertMessage
        type="info"
        title={formatMessage(
          parentalLeaveFormMessages.ratio.maxPercentageWarning,
        )}
      />
    </Box>
  )
}
