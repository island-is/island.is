import React, { FC, ReactNode } from 'react'
import {
  Box,
  Tiles,
  Button,
  Stack,
  Typography,
} from '@island.is/island-ui/core'

interface CategoriesProps {
  label?: string
  seeMoreText?: string
  children: ReactNode
}

export const Categories: FC<CategoriesProps> = ({
  label = 'Þjónustuflokkar',
  seeMoreText = 'Sjá fleiri',
  children,
}) => {
  return (
    <Box background="purple100" padding={[3, 3, 6]}>
      <Box paddingBottom={2}>
        <Typography variant="h3" as="h3">
          {label}
        </Typography>
      </Box>
      <Stack space={6}>
        <Tiles space={[2, 2, 3]} columns={[1, 1, 2, 2, 3]}>
          {children}
        </Tiles>
        <Box textAlign="center">
          <Button
            onClick={() => {
              console.log('load more cards...')
            }}
            variant="ghost"
          >
            {seeMoreText}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

export default Categories
