import React, { FC, ReactNode } from 'react'
import {
  Box,
  Typography,
  GridRow,
  GridColumn,
  GridContainer,
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
      <GridContainer>
        <GridRow>
          <GridColumn span={[6, 6, 12]}>
            <Typography variant="h3" as="h3" paddingBottom={4}>
              {label}
            </Typography>
          </GridColumn>
        </GridRow>

        <GridRow>
          {cards.map((card, index) => {
            return (
              <GridColumn key={index} span={4} paddingBottom={[3, 3, 6]}>
                <Card {...card} />
              </GridColumn>
            )
          })}
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default Categories
