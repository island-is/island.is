import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const Overview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { externalData } = application
  const answers = application.answers

  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h3">{formatMessage(m.overview.overviewTitle)}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h4">{formatMessage(m.overview.applicant)}</Text>
        <Text variant="default">
          {
            (externalData.nationalRegistry?.data as {
              fullName?: string
            })?.fullName
          }
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h4">{formatMessage(m.overview.listName)}</Text>
        <Text variant="default">{answers.listName}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h4">{formatMessage(m.overview.aboutList)}</Text>
        <Text variant="default">{answers.aboutList}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h4">{formatMessage(m.overview.listPeriod)}</Text>
        <Text variant="default">
          {answers.dateFrom + ' - ' + answers.dateTil}
        </Text>
      </Box>
    </>
  )
}

export default Overview
