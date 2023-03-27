import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Checkbox } from './Checkbox'

export default {
  title: 'Form/Checkbox',
  component: Checkbox,
  parameters: withFigma('Checkbox'),
}

const Template = (args) => <Checkbox {...args} />

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
  subLabel: 'Here is the sublabel',
  large: true,
}

export const WithTooltip = Template.bind({})
WithTooltip.args = { label: 'With a tooltip', tooltip: 'This is the tooltip' }

export const WithError = Template.bind({})
WithError.args = {
  label: 'My label',
  large: false,
  errorMessage: 'This is the error message',
  hasError: true,
  id: 'errormsg',
}
