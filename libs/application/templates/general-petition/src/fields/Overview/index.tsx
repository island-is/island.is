import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

const Overview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { externalData } = application
  const answers = application.answers
  const dates = answers.dates as any

  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h3">{formatMessage(m.overviewTitle)}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h4">{formatMessage('')}</Text>
        <Text variant="default">
          {
            (externalData.nationalRegistry?.data as {
              fullName?: string
            })?.fullName
          }
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h4">{formatMessage(m.listName)}</Text>
        <Text variant="default">{answers.listName}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h4">{formatMessage(m.aboutList)}</Text>
        <Text variant="default">{answers.aboutList}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h4">{formatMessage(m.listPeriod)}</Text>
        <Text variant="default">
          {format(new Date(dates.dateFrom as string), 'dd. MMMM yyyy', {
            locale: is,
          }) +
            ' - ' +
            format(new Date(dates.dateTil as string), 'dd. MMMM yyyy', {
              locale: is,
            })}
        </Text>
      </Box>
    </>
  )
}

export default Overview
