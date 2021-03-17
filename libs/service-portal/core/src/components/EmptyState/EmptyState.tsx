import React from 'react'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { Text, Box } from '@island.is/island-ui/core'

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
      <Box
        component="img"
        marginTop={4}
        width="full"
        src="/assets/images/emptyState.svg"
        alt=""
      />
    </>
  )
}

export default EmptyState
