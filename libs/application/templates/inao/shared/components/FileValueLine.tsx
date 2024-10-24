import React from 'react'
import { ActionCard, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'

type Props = {
  heading: MessageDescriptor
  description?: string
}

export const FileValueLine = ({ heading, description = '' }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingY={2}>
      <Text variant="h3">{formatMessage(heading)}</Text>
      <Box paddingY={2}>
        <ActionCard
          heading={description}
          headingVariant="h4"
          cta={{
            label: '',
          }}
          tag={{
            label: 'PDF',
          }}
          backgroundColor="blue"
        />
      </Box>
    </Box>
  )
}
