import React, { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { MessageDescriptor } from 'react-intl'

interface Props {
  name: string | MessageDescriptor
}

const ModuleLoadingScreen: FC<Props> = ({ name }) => {
  const { formatMessage } = useLocale()

  return (
    <Box padding={8}>
      <Text variant="h2" as="h2">
        {formatMessage(m.fetching)}
        {formatMessage(name)}
      </Text>
    </Box>
  )
}

export default ModuleLoadingScreen
