import React from 'react'
import { Box, Input, Text } from '@island.is/island-ui/core'

type PropTypes = { total: number; label: string; title?: string }

export const Total = ({ total, label }: PropTypes) => {
  return (
    <Box paddingY={4}>
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
