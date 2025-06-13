import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import React from 'react'
import { useWindowSize } from 'react-use'
import InfoCard, { InfoCardProps } from './InfoCard'
import * as styles from './InfoCard.css'
import EmptyCard from './EmptyCard'

interface InfoCardGridProps {
  cards: InfoCardProps[]
  size?: 'small' | 'large'
  empty: {
    title: string
    description: string
    img?: string
  }
  variant?: 'default' | 'detail' | 'appointment' | 'link'
}

export const InfoCardGrid: React.FC<InfoCardGridProps> = ({
  cards,
  size = 'small',
  empty: { title: emptyTitle, description: emptyDescription, img },
  variant = 'default',
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const isTablet = width < theme.breakpoints.lg && !isMobile

  if (cards.length === 0) {
    return <EmptyCard title={emptyTitle} description={emptyDescription} />
  }

  return (
    <GridContainer>
      <GridRow rowGap={2} marginBottom={6}>
        {cards.map((card, index) => (
          <GridColumn
            span={size === 'small' && !isMobile && !isTablet ? '6/12' : '12/12'}
          >
            <InfoCard
              icon={card.icon}
              key={index}
              tags={card.tags}
              img={card.img}
              size={card.size ?? size ?? 'small'}
              title={card.title}
              description={card.description}
              to={card.to}
              detail={card.detail}
              variant={variant}
              appointment={card.appointment}
            />
          </GridColumn>
        ))}
      </GridRow>
    </GridContainer>
  )
}

export default InfoCardGrid
