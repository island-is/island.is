import React from 'react'
import {
  Text,
  ResponsiveSpace,
  Stack,
  Box,
  Divider,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'

interface Props {
  space?: ResponsiveSpace
  marginBottom?: ResponsiveSpace
  children?: Array<React.ReactNode>
  label?: MessageDescriptor | string
  labelPadding?: ResponsiveSpace
}

export const InfoLineStack = ({
  space = 2,
  marginBottom = 6,
  children,
  label,
  labelPadding = 2,
}: Props) => {
  const { formatMessage } = useLocale()

  if (!children || children?.length < 1) {
    return null
  }

  return (
    <Box marginBottom={marginBottom}>
      {label && (
        <Text variant="eyebrow" color="purple400" paddingBottom={labelPadding}>
          {formatMessage(label)}
        </Text>
      )}
      <Stack space={space} dividers>
        {children}
      </Stack>
      <Box paddingY={space}>
        <Divider />
      </Box>
    </Box>
  )
}
