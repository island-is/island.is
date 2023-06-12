import { Box, Text } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import * as styles from './FormOverview.css'
import cn from 'classnames'

interface ValueLineProps {
  label: string | MessageDescriptor
  value: string | MessageDescriptor
  color?: Colors
  isPrice?: boolean
}

export const ValueLine: FC<React.PropsWithChildren<ValueLineProps>> = ({
  label,
  value,
  color,
  isPrice = false,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box className={cn(styles.formValueBreakWord)}>
      <Text variant="h5">{formatMessage(label)}</Text>
      <Text color={color} variant={isPrice ? 'h5' : 'default'}>
        {formatMessage(value)}
      </Text>
    </Box>
  )
}
