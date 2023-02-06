import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { m } from '../lib/messages'
import { useRouteError } from 'react-router-dom'

interface ModuleErrorScreenProps {
  name: string | MessageDescriptor
}

export const ModuleErrorScreen = ({ name }: ModuleErrorScreenProps) => {
  const { formatMessage } = useLocale()
  const error = useRouteError()

  // TODO - Should we do something with error
  console.error(error)

  return (
    <Box padding={8}>
      <Text variant="h2" as="h2">
        {formatMessage(m.couldNotFetch)} {formatMessage(name)},
        {formatMessage(m.somethingWrong)}
      </Text>
    </Box>
  )
}
