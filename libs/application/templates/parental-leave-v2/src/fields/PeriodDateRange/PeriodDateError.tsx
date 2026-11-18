import { FC } from 'react'

import { getErrorViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, ErrorMessage } from '@island.is/island-ui/core'

import { getPeriodIndex } from '../../lib/parentalLeaveUtils'

/**
 * Errors the period answer validator reports on the dates `PeriodDateRange`
 * writes, e.g. a period shorter than the minimum, shown under the date and
 * ratio fields rather than on the date picker, which then cannot be opened.
 */
export const PeriodDateError: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  errors,
}) => {
  const currentIndex = getPeriodIndex(field)

  if (currentIndex < 0) {
    return null
  }

  const message = [
    'endDate',
    'endDateDuration',
    'startDate',
    'firstPeriodStart',
    'useLength',
  ]
    .map((name) =>
      getErrorViaPath(errors ?? {}, `periods[${currentIndex}].${name}`),
    )
    .find((error) => typeof error === 'string' && error !== '')

  if (!message) {
    return null
  }

  return (
    <Box marginTop={1}>
      <ErrorMessage id={`periods-${currentIndex}-dateError`}>
        {message}
      </ErrorMessage>
    </Box>
  )
}
