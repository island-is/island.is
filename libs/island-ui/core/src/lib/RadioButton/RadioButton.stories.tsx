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

export const Disabled = Template.bind({})
Disabled.args = { label: 'Disabled', large: false, disabled: true }

export const Large = Template.bind({})
Large.args = { label: 'Large version', large: true }

export const LargeDisabled = Template.bind({})
LargeDisabled.args = { label: 'Large disabled', large: true, disabled: true }

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

export const License = () => (
  <Box background="white" padding={3}>
    <RadioButton
      label="Ég staðfesti að nota núverandi mynd."
      backgroundColor="blue"
      large
      license
      imageSrc="https://images.ctfassets.net/8k0h54kbe6bj/5u0bSKny81QfKj3gC3tu0s/1415f3e408bd9097b8d5c8c4cfcc8425/Photolicense.png"
      signature="https://images.ctfassets.net/8k0h54kbe6bj/1hwZOVWlHWzO6dq7QAJmfy/97eb1cdc7a2e2af3dec222771e1fda73/Signaturesignature.png"
    />
  </Box>
)
