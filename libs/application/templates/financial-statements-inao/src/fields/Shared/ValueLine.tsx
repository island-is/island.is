import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
interface ValueLineProps {
  label: string | MessageDescriptor
  value?: string | MessageDescriptor
  isTotal?: boolean
}

export const ValueLine: FC<React.PropsWithChildren<ValueLineProps>> = ({
  label,
  value = '-',
  isTotal = false,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingY={1} style={isTotal ? { borderTop: '1px solid black' } : {}}>
      <Text variant="medium" fontWeight="semiBold" as="label">
        {formatMessage(label)}
      </Text>

      <Text
        variant="default"
        as="p"
        fontWeight={isTotal ? 'semiBold' : 'regular'}
      >
        {formatMessage(value)}
      </Text>
    </Box>
  )
}
