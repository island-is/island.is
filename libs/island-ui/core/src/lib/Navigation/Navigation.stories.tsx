import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Box } from '../Box/Box'
import { Navigation } from './Navigation'
import { categories, pages, pagesWithAccordion } from './mock'

export default {
  title: 'Navigation/Navigation',
  component: Navigation,
  parameters: withFigma('Navigation'),
}

const Template = (args) => (
  <Box style={{ width: '318px' }}>
    <Navigation {...args} />
  </Box>
)

export const Blue = Template.bind({})
Blue.args = {
  title: 'Titill á yfirsíðu',
  titleLink: '/titill-a-yfirsidu',
  activeItemTitle: 'Hér er virk undirsíða',
  colorScheme: 'blue',
  items: pages,
  isMenuDialog: true,
}

export const Purple = Template.bind({})
Purple.args = {
  title: 'Titill á yfirflokk',
  titleLink: '/titill-a-yfirflokk',
  activeItemTitle: 'Eldri borgarar',
  colorScheme: 'purple',
  items: categories,
}

export const DarkBlue = Template.bind({})
DarkBlue.args = {
  title: 'Titill á yfirsíðu',
  titleLink: '/titill-a-yfirsidu',
  activeItemTitle: 'Hér er virk undirsíða',
  colorScheme: 'darkBlue',
  items: pages,
}

export const UsingAccordion = Template.bind({})
UsingAccordion.args = {
  title: 'Titill á yfirsíðu',
  titleLink: '/titill-a-yfirsidu',
  activeItemTitle: 'Hér er virk undirsíða',
  colorScheme: 'purple',
  items: pagesWithAccordion,
}
