import React from 'react'

import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

interface NoContentCardProps {
  searchText: string
}

const NoContentCard = ({ searchText }: NoContentCardProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      display="flex"
      borderRadius="large"
      border="standard"
      width="full"
      background="dark100"
      paddingX={4}
      paddingY={3}
      justifyContent="spaceBetween"
      alignItems="center"
    >
      <Stack space={1}>
        <Text variant="h3">{searchText}</Text>
        <Text variant="default">{formatMessage(m.noContent)}</Text>
      </Stack>
    </Box>
  )
}

export default NoContentCard
