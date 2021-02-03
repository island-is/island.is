import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { RadioButton } from './RadioButton'
import { Box } from '../Box/Box'

export default {
  title: 'Form/RadioButton',
  component: RadioButton,
  decorators: [withDesign],
  parameters: withFigma('RadioButton'),
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
