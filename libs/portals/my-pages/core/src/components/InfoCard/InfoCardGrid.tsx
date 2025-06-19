import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import React from 'react'
import { useWindowSize } from 'react-use'
import EmptyCard from './EmptyCard'
import InfoCard, { InfoCardProps } from './InfoCard'
import * as styles from './InfoCard.css'

interface InfoCardGridProps {
  cards: (InfoCardProps | null)[]
  size?: 'small' | 'large'
  empty?: {
    title: string
    description?: string
    img?: string
  }
  variant?: 'default' | 'detail' | 'appointment' | 'link'
}

export const InfoCardGrid: React.FC<InfoCardGridProps> = ({
  cards,
  size = 'small',
  empty,
  variant = 'default',
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const isTablet = width < theme.breakpoints.lg && !isMobile

  if (cards.length === 0 && empty) {
    return (
      <EmptyCard
        title={empty?.title}
        description={empty?.description}
        size={size}
      />
    )
  }

  return (
    <GridContainer>
      <GridRow rowGap={2} marginBottom={6}>
        {cards.filter(Boolean).map((card, index) => (
          <GridColumn
            span={size === 'small' && !isMobile && !isTablet ? '6/12' : '12/12'}
            className={styles.gridCard}
            key={`infocard-${card?.title ?? index}`}
          >
            {card && (
              <InfoCard
                tags={card.tags}
                img={card.img}
                size={card.size ?? size ?? 'small'}
                title={card.title}
                description={card.description}
                to={card.to}
                detail={card.detail}
                variant={variant}
                appointment={card.appointment}
                loading={card.loading}
                tooltip={card.tooltip}
              />
            )}
          </GridColumn>
        ))}
      </GridRow>
    </GridContainer>
  )
}

export default InfoCardGrid
