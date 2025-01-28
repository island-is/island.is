import React from 'react'

import { Box, Inline, Text } from '@island.is/island-ui/core'

interface XroadValueProps {
  label: string
  value: string
  showDivider: boolean
}

export const XroadValue = ({ label, value, showDivider }: XroadValueProps) => {
  return (
    <Box display="flex" borderColor="blue200">
      <Inline space={1}>
        <Text variant="small" color="blue600">
          {label}
        </Text>
        <Text variant="small" color="blue600" fontWeight="semiBold">
          {value}
        </Text>
        {showDivider && (
          <Text variant="eyebrow" color="blue200">
            |
          </Text>
        )}
      </Inline>
    </Box>
  )
}

export default XroadValue
