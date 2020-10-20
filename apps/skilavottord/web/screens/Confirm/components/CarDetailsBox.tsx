import React, { FC } from 'react'
import { Box, Typography, Stack } from '@island.is/island-ui/core'
import { OutlinedBox } from '@island.is/skilavottord-web/components'
import { MockCar } from '@island.is/skilavottord-web/types'

interface BoxProps {
  car: MockCar
}

export const CarDetailsBox: FC<BoxProps> = ({
  car: { permno, type, newregdate, color, status },
}: BoxProps) => {
  return (
    <OutlinedBox>
      <Box paddingX={4} paddingY={4}>
        <Box>
          <Stack space={1}>
            <Typography variant="h3">{permno}</Typography>
            <Typography variant="p">{`${type}, ${newregdate}`}</Typography>
          </Stack>
        </Box>
      </Box>
    </OutlinedBox>
  )
}
