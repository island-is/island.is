import React, { useEffect } from 'react'
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

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Box padding={8}>
      <Text variant="h2" as="h2">
        {formatMessage(m.somethingWrong)}
      </Text>
      <Text>
        {formatMessage(m.couldNotFetch)} <i>{formatMessage(name)}</i>
      </Text>
    </Box>
  )
}
