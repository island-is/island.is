import React, { FC, ReactNode } from 'react'
import {
  Box,
  Tiles,
  Stack,
  Typography,
  Grid,
  GridItem,
} from '@island.is/island-ui/core'
import { Card } from '../Card/Card'

interface Card {
  title: string
  description: string
  href: string
  as: string
}

interface CategoriesProps {
  label?: string
  cards: Card[]
}

export const Categories: FC<CategoriesProps> = ({
  label = 'Þjónustuflokkar',
  cards,
}) => {
  return (
    <Box background="purple100" paddingY={8}>
      <Typography variant="h3" as="h3" paddingBottom={4}>
        {label}
      </Typography>
      <Grid>
        {cards.map((card, index) => {
          return (
            <GridItem key={index} span={4} paddingBottom={[3, 3, 6]}>
              <Card {...card} />
            </GridItem>
          )
        })}
      </Grid>
    </Box>
  )
}

export default Categories
