import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import {
  SecondarySchoolStudyCard,
  SecondarySchoolStudyCardProps,
} from './SecondarySchoolStudyCard'

interface StudyCardsGridProps {
  cards: Array<SecondarySchoolStudyCardProps>
  isGridView: boolean
  gap?: keyof typeof theme.spacing
}

export const StudyCardsGrid = ({
  cards,
  isGridView,
  gap = 2,
}: StudyCardsGridProps) => {
  if (cards.length < 1) return null

  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: isGridView
          ? 'repeat(auto-fit, minmax(270px, 1fr))'
          : '1fr',
        gap: theme.spacing[gap],
      }}
    >
      {cards.map((card) => (
        <SecondarySchoolStudyCard
          key={card.id}
          size={isGridView ? 'medium' : 'large'}
          {...card}
        />
      ))}
    </Box>
  )
}
