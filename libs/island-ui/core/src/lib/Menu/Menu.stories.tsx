import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { withFigma } from '../../utils/withFigma'

import { Menu } from './Menu'

export default {
  title: 'Navigation/Menu',
  component: Menu,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/cl7qnkUWOFwgMQKt2FsiZn/H%C3%B6nnun?node-id=5393%3A0',
    mobile:
      'https://www.figma.com/file/cl7qnkUWOFwgMQKt2FsiZn/H%C3%B6nnun?node-id=5580%3A2504',
  }),
}

const Template = (args) => <Menu {...args} />

export const Primary = Template.bind({})
Primary.args = { baseId: 'story' }
