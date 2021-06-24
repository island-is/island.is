import React from 'react'
import {
  Text,
  GridRow,
  GridColumn,
  GridContainer,
  ColorSchemeContext,
} from '@island.is/island-ui/core'
import { BackgroundSchemeContext} from '../../context'
import { Card } from '../Card/Card'
import { LinkResolverResponse } from '@island.is/web/hooks/useLinkResolver'

interface Card {
  title: string
  description: string
  link: LinkResolverResponse
}

interface DataLinkSectionProps {
  title?: string
  titleId?: string
  description?: string
  cards: Card[]
}

export const DataLinkSection = ({
  title = 'Þjónustuflokkar',
  titleId,
  description,
  cards,
}: DataLinkSectionProps) => {
  const titleProps = titleId ? { id: titleId } : {}

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={['6/12', '6/12', '12/12']}>
          <Text variant="h3" as="h2" paddingBottom={4} {...titleProps}>
            {title}
          </Text>
          <Text paddingBottom={4}>{description}</Text>
        </GridColumn>
      </GridRow>

      <GridRow>
        {cards.map((card, index) => {
          return (
            <GridColumn
              key={index}
              span={['12/12', '6/12', '6/12', '4/12']}
              paddingBottom={3}
            >
              <BackgroundSchemeContext.Provider value={{ backgroundScheme: 'blue' }}>
                <Card {...card} />
              </BackgroundSchemeContext.Provider>
            </GridColumn>
          )
        })}
      </GridRow>
    </GridContainer>
  )
}

export default DataLinkSection
