import React from 'react'
import { Box, Input, Text } from '@island.is/island-ui/core'

type PropTypes = { name: string, total: number; label: string; title?: string }

export const Total = ({ name, total, label, title }: PropTypes) => {
  return (
    <Box paddingY={3}>
      {title ? (
        <Text as="h4" variant="h4" paddingBottom={1}>
          {title}
        </Text>
      ) : null}
      <Input
        id={name}
        name={name}
        value={total}
        label={label}
        readOnly
        
      />
    </Box>
  )
}
