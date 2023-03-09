import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { getFootNoteByType } from './helper'

interface Props {
  therapyType: string
}

export const FootNote: FC<Props> = ({ therapyType }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={4}>
      <Text variant="small" paddingBottom={2}>
        {getFootNoteByType(therapyType, formatMessage).first}
      </Text>
      <Text variant="small" paddingBottom={2}>
        {getFootNoteByType(therapyType, formatMessage).second}
      </Text>
      <Text variant="small" paddingBottom={2}>
        {getFootNoteByType(therapyType, formatMessage).third}
      </Text>
      <Text variant="small">
        {getFootNoteByType(therapyType, formatMessage).fourth}
      </Text>
    </Box>
  )
}
