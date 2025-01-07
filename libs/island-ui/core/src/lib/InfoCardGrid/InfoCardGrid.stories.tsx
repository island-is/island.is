import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import { withFigma } from '../../utils/withFigma'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Box } from '../Box/Box'
import { InfoCardGrid } from './InfoCardGrid'

const meta: Meta<typeof InfoCardGrid> = {
  title: 'Components/InfoCardGrid',
  component: InfoCardGrid,
  parameters: withFigma('InfoCardGrid'),
  argTypes: {
    variant: {
      options: ['simple', 'detailed'],
      control: {
        type: 'select',
      },
    },
    columns: {
      defaultValue: 2,
      control: {
        type: 'number',
        min: 1,
        max: 3,
      },
    },
  },
  args: {
    cardsBackground: 'white',
    cardsBorder: 'blue200',
  },
}

export default meta

type Story = StoryObj<typeof InfoCardGrid>

const generateSimpleCard = (id: string | number) => ({
  id: `test-${id}`,
  title: `Lorem ipsum`,
  description: `Lorem ipsum`,
  eyebrow: `Lorem ipsum`,
  link: {
    label: `test-${id}`,
    href: '/',
  },
})

const generateDetailedCard = (id: string | number) => ({
  id: `test-${id}`,
  title: 'Card title',
  description:
    'Torem ipsum dolor sit amet, consectetur adipiscing elit interdum, ac aliquet odio mattis.',
  eyebrow: `Lorem ipsum`,
  subEyebrow: `Lorem ipsum`,
  detailLines: [
    {
      icon: 'archive',
      text: `Lorem ipsum`,
    },
    {
      icon: 'calendar',
      text: `Lorem ipsum`,
    },
    {
      icon: 'airplane',
      text: `Lorem ipsum`,
    },
    {
      icon: 'car',
      text: `Lorem ipsum`,
    },
    {
      icon: 'copy',
      text: `Lorem ipsum`,
    },
  ],
  tags: [
    {
      label: 'test 1 tag',
    },
  ],
  logo: '../IconRC/icons/Add',
  logoAlt: 'Icon',
  link: {
    label: `test-${id}`,
    href: '/',
  },
})

const generateCards = (count: number, variant: 'simple' | 'detailed') => {
  console.log(variant)
  return [...Array(count)].map((_, idx) =>
    variant === 'simple' ? generateSimpleCard(idx) : generateDetailedCard(idx),
  )
}

export const DetailedOneColumn: Story = {
  args: {
    variant: 'detailed',
    cards: generateCards(4, 'detailed'),
    cardsBackground: 'white',
    cardsBorder: 'blue200',
    columns: 1,
  },
}

export const SimpleThreeColumn: Story = {
  args: {
    cards: generateCards(7, 'simple'),
    cardsBackground: 'white',
    cardsBorder: 'blue200',
    columns: 3,
  },
}
