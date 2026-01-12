import React from 'react'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { BackgroundImage, DataLinkCard } from '@island.is/web/components'
import type { LinkCard } from '@island.is/web/graphql/schema'

interface DataLinkSectionProps {
  title?: string
  titleId?: string
  description?: string
  image?: { title: string; url: string }
  cards: LinkCard[]
}

export const DataLinkSection = ({
  title = 'Þjónustuflokkar',
  titleId,
  description,
  image,
  cards,
}: DataLinkSectionProps) => {
  const titleProps = titleId ? { id: titleId } : {}

  return (
    <GridContainer>
      <GridRow marginBottom={10}>
        <GridColumn span={['12/12', '5/12', '5/12']}>
          <Text variant="h1" as="h1" paddingBottom={4} {...titleProps}>
            {title}
          </Text>
          <Text paddingBottom={4}>{description}</Text>
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12']}>
          <Box width="full">
            <BackgroundImage
              width={600}
              positionX="right"
              backgroundSize="contain"
              image={image}
            />
          </Box>
        </GridColumn>
      </GridRow>
      <GridRow>
        {cards.map((card, index) => (
          <GridColumn
            key={index}
            span={['12/12', '6/12', '6/12', '4/12']}
            paddingBottom={3}
          >
            <DataLinkCard {...card} />
          </GridColumn>
        ))}
      </GridRow>
    </GridContainer>
  )
}

export default DataLinkSection
