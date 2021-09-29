import React, { FC } from 'react'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from '@formatjs/intl'

export const SectionHeading: FC<{ title: string | MessageDescriptor }> = ({
  title,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Text variant="h4" marginTop={4} marginBottom={3}>
      {formatMessage(title)}
    </Text>
  )
}

export const ValueLine: FC<{
  label: string | MessageDescriptor
  value: string | MessageDescriptor
}> = ({ label, value }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Text variant="h5">{formatMessage(label)}</Text>
      <Text>{formatMessage(value)}</Text>
      <Box paddingY={3}>
        <Divider />
      </Box>
    </>
  )
}
