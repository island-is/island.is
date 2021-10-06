import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { RadioButton } from './RadioButton'
import { Box } from '../Box/Box'

export default {
  title: 'Form/RadioButton',
  component: RadioButton,
  parameters: withFigma('RadioButton'),
}

const Template = (args) => <RadioButton {...args} />

export const Default = Template.bind({})
Default.args = { label: 'My label', large: false }

export const Large = Template.bind({})
Large.args = { label: 'Large version', large: true }

export const WithSubLabel = Template.bind({})
WithSubLabel.args = {
  label: 'Large version',
  large: true,
  subLabel: 'Some sublabel',
}

export const WithTooltip = Template.bind({})
WithTooltip.args = { label: 'With a tooltip', tooltip: 'This is the tooltip' }

export const FilledWhite = () => (
  <Box background="blue100" padding={3}>
    <RadioButton
      label="Filled white background"
      backgroundColor="white"
      large
    />
  </Box>
)

export const FilledBlue = () => (
  <Box background="white" padding={3}>
    <RadioButton label="Filled blue background" backgroundColor="blue" large />
  </Box>
)
