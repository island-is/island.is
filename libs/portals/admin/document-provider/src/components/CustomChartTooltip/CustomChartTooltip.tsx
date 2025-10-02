import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { formatNumber, getFullMonthName } from '../../lib/utils'

interface TooltipPayload {
  color: string
  dataKey: string
  name: string
  value: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string | number
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <Box
        background="white"
        border="standard"
        borderRadius="standard"
        padding={2}
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
      >
        <Text variant="small" fontWeight="semiBold" marginBottom={1}>
          {getFullMonthName(label)}
        </Text>
        {payload.map((entry: TooltipPayload, index: number) => (
          <Box key={index} display="flex" alignItems="center">
            <span
              style={{
                backgroundColor: entry.color,
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                marginRight: 8,
              }}
            />
            <Text variant="small">
              {entry.name}: {formatNumber(entry.value)}
            </Text>
          </Box>
        ))}
      </Box>
    )
  }
  return null
}
