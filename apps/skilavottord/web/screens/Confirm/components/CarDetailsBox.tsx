import React, { FC } from 'react'
import { Box, Typography, Stack } from '@island.is/island-ui/core'
import { OutlinedBox } from '@island.is/skilavottord-web/components'
import { Car } from '@island.is/skilavottord-web/types'

interface BoxProps {
  car: Car
}

export const CarDetailsBox: FC<BoxProps> = ({
  car: { permno, type, firstRegDate },
}: BoxProps) => {
  return (
    <OutlinedBox>
      <Box paddingX={4} paddingY={4}>
        <Box>
          <Stack space={1}>
            <Typography variant="h3">{permno}</Typography>
            <Typography variant="p">{`${type}, ${firstRegDate}`}</Typography>
          </Stack>
        </Box>
      </Box>
    </OutlinedBox>
  )
}
