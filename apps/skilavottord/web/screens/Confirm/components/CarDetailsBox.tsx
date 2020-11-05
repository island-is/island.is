import React, { FC } from 'react'
import { Box, Typography, Stack } from '@island.is/island-ui/core'
import { OutlinedBox } from '@island.is/skilavottord-web/components'
import { Car } from '@island.is/skilavottord-web/types'
import { formatYear } from '@island.is/skilavottord-web/utils'

interface BoxProps {
  car: Car
}

export const CarDetailsBox: FC<BoxProps> = ({
  car: { permno, type, firstRegDate },
}: BoxProps) => {
  const modelYear = formatYear(firstRegDate, 'dd.MM.yyyy')

  return (
    <OutlinedBox>
      <Box paddingX={4} paddingY={4}>
        <Box>
          <Stack space={1}>
            <Typography variant="h3">{permno}</Typography>
            <Typography variant="p">{`${type}, ${modelYear}`}</Typography>
          </Stack>
        </Box>
      </Box>
    </OutlinedBox>
  )
}
