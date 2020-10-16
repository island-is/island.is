import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { RadioButton } from './RadioButton'
import { Box } from '../Box/Box'

export default {
  title: 'Form/RadioButton',
  component: RadioButton,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=49%3A135',
    mobile:
      'https://www.figma.com/file/rU3mPM1cLfHa3u7TWuutPQ/UI-Library-%E2%80%93-%F0%9F%93%B1Mobile?node-id=30%3A2',
  }),
}

const Template = (args) => <RadioButton {...args} />

export const Primary = Template.bind({})
Primary.args = { label: 'My label', large: false }

export const Large = Template.bind({})
Large.args = { label: 'Large version', large: true }

export const WithTooltip = Template.bind({})
WithTooltip.args = { label: 'With a tooltip', tooltip: 'This is the tooltip' }

export const Filled = () => (
  <Box background={'blue100'} padding={3}>
    <RadioButton label="Filled white background" filled large />
  </Box>
)
