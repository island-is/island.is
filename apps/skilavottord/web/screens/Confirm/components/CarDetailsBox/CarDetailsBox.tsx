import React, { FC } from 'react'
import { Box, Typography, Stack } from '@island.is/island-ui/core'
import OutlinedBox from '@island.is/skilavottord-web/components/OutlinedBox/OutlinedBox'

//TODO: Move to graphql schema (see air-discount-scheme)
interface Car {
  id: string
  name: string
  model: string
  year: number
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
  car: { id, brand, model, year, name, color, status, hasCoOwner = false },
}: BoxProps) => {
  return (
    <OutlinedBox>
      <Box paddingX={4} paddingY={3}>
        <Box>
          <Stack space={1}>
            <Typography variant="h5">{id}</Typography>
            <Typography variant="p">{`${name} ${model}, ${year}`}</Typography>
          </Stack>
        </Box>
      </Box>
    </OutlinedBox>
  )
}
