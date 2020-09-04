import React from 'react'
import {
  GridContainer,
  GridColumn,
  GridRow,
  Typography,
  ArrowLink,
  Box,
} from '@island.is/island-ui/core'
import { News } from '@island.is/api/schema'
import { NewsCard } from '../NewsCard'

// LatestNewsSection on desktop displays latest 3 news cards in grid.
// On mobile it displays 3 news cards in a slider. (TODO)

interface LatestNewsProps {
  label: string
  items: News[]
}

const LatestNewsSection: React.FC<LatestNewsProps> = ({
  items = [],
  label,
}) => {
  const newsItems = items.slice(0, 3)

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span="6/12">
          <Typography variant="h3" as="h3" paddingBottom={4}>
            {label}
          </Typography>
        </GridColumn>
        <GridColumn span="6/12">
          <Box display="flex" justifyContent="flexEnd" paddingBottom={4}>
            <Typography variant="h3" as="h3" paddingBottom={4}>
              <ArrowLink href="/frett" arrowHeight={16}>
                Sjá fleiri
              </ArrowLink>
            </Typography>
          </Box>
        </GridColumn>
      </GridRow>
      <GridRow>
        {newsItems.map((newsItem) => (
          <GridColumn
            span={['12/12', '12/12', '12/12', '4/12']}
            key={newsItem.slug}
          >
            <NewsCard
              title={newsItem.title}
              subtitle={newsItem.subtitle}
              introduction={newsItem.intro}
              slug={newsItem.slug}
              image={newsItem.image}
            />
          </GridColumn>
        ))}
      </GridRow>
    </GridContainer>
  )
}

export default LatestNewsSection
