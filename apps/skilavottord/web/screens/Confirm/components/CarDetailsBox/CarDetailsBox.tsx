import React, { FC } from 'react'
import { Box, Typography, Stack } from '@island.is/island-ui/core'
import { OutlinedBox } from '@island.is/skilavottord-web/components'

interface Car {
  permno: string
  type: string
  newregdate: number
  color: string
  recyclable: boolean
  brand?: string
  status?: string
  hasCoOwner?: boolean
}

interface BoxProps {
  car: Car
}

export const CarDetailsBox: FC<BoxProps> = ({
  car: { permno, type, newregdate, color, status, hasCoOwner = false },
}: BoxProps) => {
  return (
    <OutlinedBox>
      <Box paddingX={4} paddingY={4}>
        <Box>
          <Stack space={1}>
            <Typography variant="h5">{permno}</Typography>
            <Typography variant="p">{`${type}, ${newregdate}`}</Typography>
          </Stack>
        </Box>
      </Box>
    </OutlinedBox>
  )
}
