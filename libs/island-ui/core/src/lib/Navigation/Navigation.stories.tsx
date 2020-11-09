import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { withFigma } from '../../utils/withFigma'
import { Box } from '../Box/Box'
import { Navigation } from './Navigation'
import { categories, pages } from './mock'

export default {
  title: 'Navigation/Navigation',
  component: Navigation,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/cl7qnkUWOFwgMQKt2FsiZn/H%C3%B6nnun?node-id=3494%3A1&viewport=-1795%2C983%2C0.47280967235565186',
  }),
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
  colorScheme: 'blue',
  items: pages,
}

export const Purple = Template.bind({})
Purple.args = {
  title: 'Titill á yfirflokk',
  titleLink: '/titill-a-yfirflokk',
  colorScheme: 'purple',
  items: categories,
}

export const DarkBlue = Template.bind({})
DarkBlue.args = {
  title: 'Titill á yfirsíðu',
  titleLink: '/titill-a-yfirsidu',
  colorScheme: 'darkBlue',
  items: pages,
}
