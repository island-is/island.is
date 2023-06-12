import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { getFootNoteByType } from './helper'

interface Props {
  type: string
}

export const FootNote: FC<React.PropsWithChildren<Props>> = ({ type }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={4}>
      <Text variant="small" paddingBottom={2}>
        {getFootNoteByType(type, formatMessage).first}
      </Text>
      <Text variant="small" paddingBottom={2}>
        {getFootNoteByType(type, formatMessage).second}
      </Text>
    </Box>
  )
}
