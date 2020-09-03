import React, { FC } from 'react'
import {
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
  title?: string
  cards: Card[]
}

export const Categories: FC<CategoriesProps> = ({
  title = 'Þjónustuflokkar',
  cards,
}) => {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={[6, 6, 12]}>
          <Typography variant="h3" as="h3" paddingBottom={4}>
            {title}
          </Typography>
        </GridColumn>
      </GridRow>

      <GridRow>
        {cards.map((card, index) => {
          return (
            <GridColumn key={index} span={[12, 6, 6, 4]} paddingBottom={3}>
              <Card {...card} />
            </GridColumn>
          )
        })}
      </GridRow>
    </GridContainer>
  )
}

export default Categories
