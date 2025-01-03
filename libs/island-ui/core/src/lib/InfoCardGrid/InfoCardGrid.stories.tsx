import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Box } from '../Box/Box'
import { InfoCardGrid } from './InfoCardGrid'

export default {
  title: 'Components/InfoCardGrid',
  text: 'cingbong',
  component: InfoCardGrid,
  parameters: withFigma('InfoCardGrid'),
}

const generateSimpleCard = (id: string | number) => ({
  id: `test-${id}`,
  title: `test-${id}`,
  description: `test-${id}`,
  eyebrow: `test-${id}-eyebrow`,
  link: {
    label: `test-${id}`,
    href: '/',
  },
})

const generateDetailedCard = (id: string | number) => ({
  id: `test-${id}`,
  title: `test-${id}`,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  eyebrow: `test-${id}-eyebrow`,
  subEyebrow: `test-${id}-subEyebrow`,
  detailLines: [
    {
      icon: 'archive',
      text: 'test icon 1',
    },
    {
      icon: 'calendar',
      text: 'test icon 2',
    },
    {
      icon: 'airplane',
      text: 'test icon 3',
    },
    {
      icon: 'car',
      text: 'test icon 4',
    },
    {
      icon: 'copy',
      text: 'test icon 5',
    },
  ],
  tags: [
    {
      label: 'test 1 tag',
    },
  ],
  logo: '../IconRC/icons/Add',
  logoAlt: 'bong',
  link: {
    label: `test-${id}`,
    href: '/',
  },
})

const generateCards = (count: number, variant: 'simple' | 'detailed') => {
  return [...Array(count)].map((_, idx) =>
    variant === 'simple' ? generateSimpleCard(idx) : generateDetailedCard(idx),
  )
}

export const Basic = () => (
  <Box paddingY={[1, 2]} backgroundColor="red">
    <InfoCardGrid
      variant="detailed"
      cardsBackground={'red'}
      columns={2}
      cards={generateCards(8, 'detailed')}
    />
  </Box>
)
