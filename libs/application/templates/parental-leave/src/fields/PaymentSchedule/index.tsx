import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import Timeline, { Period } from './components/Timeline'
import { Box } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'

const PaymentSchedule: FC<FieldBaseProps> = ({ error, field, application }) => {
  const { description } = field
  const { formatMessage } = useLocale()

  const dob = '2021-01-03T00:00:00.000Z'
  const dobDate = new Date(dob)
  const periods: Period[] = [
    {
      startDate: dob,
      endDate: '2021-07-13T00:00:00.000Z',
      title: 'Period 1 - 100%',
    },
    {
      startDate: '2021-07-13T00:00:00.000Z',
      endDate: '2021-12-03T00:00:00.000Z',
      title: 'Period 2 - 50%',
    },
    {
      startDate: dob,
      endDate: '2021-05-17T00:00:00.000Z',
      title: 'Other parent - 50%',
      color: theme.color.red200,
    },
    {
      startDate: '2021-03-13T00:00:00.000Z',
      endDate: '2021-10-03T00:00:00.000Z',
      title: 'Other parent - 50%',
      color: theme.color.red200,
    },
  ]

  return (
    <Box>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box marginTop={3}>
        <Timeline
          initDate={dobDate}
          title="Expected birth date"
          titleSmall="Birth date"
          periods={periods}
        />
      </Box>
    </Box>
  )
}

export default PaymentSchedule
