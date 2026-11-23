import React from 'react'
import { render, screen } from '@testing-library/react'

import { StatisticCard } from './StatisticCard'

describe('StatisticCard', () => {
  it('renders title, content and subtext', () => {
    render(
      <StatisticCard
        title="Leiðréttur launamunur"
        content="8,50% konum í óhag"
        subtext="Viðmið: 3,90%"
        color="purple"
      />,
    )
    expect(screen.getByText('Leiðréttur launamunur')).toBeInTheDocument()
    expect(screen.getByText('8,50% konum í óhag')).toBeInTheDocument()
    expect(screen.getByText('Viðmið: 3,90%')).toBeInTheDocument()
  })
})
