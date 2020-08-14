import React, { FC, ReactNode } from 'react'
import { Box, Tiles, Stack, Typography } from '@island.is/island-ui/core'

interface CategoriesProps {
  label?: string
  children: ReactNode
}

export const Categories: FC<CategoriesProps> = ({
  label = 'Þjónustuflokkar',

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
      </Stack>
    </Box>
  )
}

export default Categories
