import React from 'react'
import { Box, Input, Text } from '@island.is/island-ui/core'

type PropTypes = { total: number; label: string; title?: string }

export const Total = ({ total, label, title }: PropTypes) => {
  return (
    <Box paddingY={3}>
      {title ? (
        <Text as="h4" variant="h4" paddingBottom={1}>
          {title}
        </Text>
      ) : null}
      <Input
        id="income.id"
        name="income.total"
        value={total}
        label={label}
        readOnly
      />
    </Box>
  )
}
