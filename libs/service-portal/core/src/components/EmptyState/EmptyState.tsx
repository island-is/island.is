import React from 'react'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { Text, Box } from '@island.is/island-ui/core'
import { EmptyImage } from './EmptyImage'

interface Props {
  title: MessageDescriptor
  description?: MessageDescriptor
}

export const EmptyState = ({ title, description }: Props) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <Text marginBottom={1} variant="h3">
        {formatMessage(title)}
      </Text>
      {description && <Text>{formatMessage(description)}</Text>}
      <Box marginTop={4}>
        <EmptyImage width="100%" />
      </Box>
    </>
  )
}

export default EmptyState
