import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Select } from './Select'

export default {
  title: 'Form/Select',
  component: Select,
  parameters: withFigma('Select'),
}

const Template = (args) => <Select {...args} />

const options = [
  {
    label: 'Text 1',
    value: '0',
  },
  {
    label: 'Text 2',
    value: '1',
  },
  {
    label: 'Text 3',
    value: '2',
  },
]

const selectArgs = {
  name: 'select',
  label: 'Label text',
  placeholder: 'Text',
  options: options,
  backgroundColor: 'white',
  isDisabled: false,
  noOptionsMessage: 'Enginn valmöguleiki',
  isClearable: false,
  isSearchable: false,
  size: 'md',
  hasError: false,
}

export const Default = Template.bind({})
Default.args = selectArgs

export const Blue = Template.bind({})
Blue.args = {
  ...selectArgs,
  backgroundColor: 'blue',
}

export const Disabled = Template.bind({})
Disabled.args = {
  ...selectArgs,
  isDisabled: true,
}

export const NoOption = Template.bind({})
NoOption.args = {
  ...selectArgs,
  noOptionsMessage: 'Enginn valmöguleiki',
}

export const Clearable = Template.bind({})
Clearable.args = {
  ...selectArgs,
  isClearable: true,
}

export const Searchable = Template.bind({})
Searchable.args = {
  ...selectArgs,
  isSearchable: true,
}

export const SizeSm = Template.bind({})
SizeSm.args = {
  ...selectArgs,
  size: 'sm',
}

export const SizeXs = Template.bind({})
SizeXs.args = {
  ...selectArgs,
  size: 'xs',
}

export const WithError = Template.bind({})
WithError.args = {
  ...selectArgs,
  hasError: true,
}
