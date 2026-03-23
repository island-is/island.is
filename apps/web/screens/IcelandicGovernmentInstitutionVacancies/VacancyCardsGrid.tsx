import React from 'react'

import type { BoxProps } from '@island.is/island-ui/core'
import { Box, InfoCard } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

// Extract InfoCard props directly from the component - single source of truth
type InfoCardProps = React.ComponentProps<typeof InfoCard>

interface VacancyCardsGridProps {
  cards: Omit<InfoCardProps, 'size'>[] // size is controlled by this component
  columns: 1 | 2
  gap?: keyof typeof theme.spacing
  variant?: InfoCardProps['variant']
  cardsBackground?: BoxProps['background']
  cardsBorder?: BoxProps['borderColor']
  forceMediumSize?: boolean
}

export const VacancyCardsGrid = ({
  cards,
  columns,
  gap = 2,
  variant,
  cardsBackground,
  cardsBorder,
  forceMediumSize = false,
}: VacancyCardsGridProps) => {
  if (cards.length < 1) return null

  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: columns === 1 ? '1fr' : '1fr 1fr',
        gap: theme.spacing[gap],
      }}
    >
      {cards.map((card) => (
        <InfoCard
          key={card.id}
          background={cardsBackground}
          padding={3}
          borderColor={cardsBorder}
          variant={variant}
          size={forceMediumSize ? 'medium' : columns === 1 ? 'large' : 'medium'}
          {...card}
        />
      ))}
    </Box>
  )
}
