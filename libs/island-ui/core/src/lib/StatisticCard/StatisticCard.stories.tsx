import React from 'react'

import { Box } from '../Box/Box'
import { StatisticCard } from './StatisticCard'

export default {
  title: 'Cards/StatisticCard',
  component: StatisticCard,
}

export const Default = () => (
  <Box display="flex" columnGap={4}>
    <StatisticCard title="Meðaltímakaup karla" content="7.631 kr./klst." />
    <StatisticCard title="Meðaltímakaup kvenna" content="4.882 kr./klst." />
  </Box>
)

export const PurpleWithSubtext = () => (
  <Box display="flex">
    <StatisticCard
      title="Leiðréttur launamunur"
      content="8,50% konum í óhag"
      subtext="Viðmið: 3,90%"
      color="purple"
    />
  </Box>
)
