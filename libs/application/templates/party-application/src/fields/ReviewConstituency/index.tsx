import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const ReviewConstituency: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h5">{formatMessage(m.overviewSection.partyletter)}</Text>
        <Text>{'B'}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">{formatMessage(m.overviewSection.party)}</Text>
        <Text>{'Framsóknarflokkur'}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.overviewSection.responsiblePerson)}
        </Text>
        <Text>{'Örvar Þór Sigurðsson'}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.overviewSection.constituency)}
        </Text>
        <Text>{answers.constituency}</Text>
      </Box>
    </>
  )
}

export default ReviewConstituency
