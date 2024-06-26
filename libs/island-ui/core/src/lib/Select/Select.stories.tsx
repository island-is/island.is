import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Select } from './Select'
import type { Meta, StoryObj } from '@storybook/react'

const config: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  parameters: withFigma('Select'),
  argTypes: {
    name: { description: 'Field name' },
    label: { description: 'Label text', control: { type: 'text' } },
    placeholder: { description: 'Placeholder text' },
    backgroundColor: {
      description: 'Background color',
      options: ['white', 'blue'],
      control: { type: 'radio' },
      defaultValue: 'white',
    },
    noOptionsMessage: { description: 'No options message' },
    size: {
      description: 'Field size',
      options: ['xs', 'sm', 'md'],
      control: { type: 'radio' },
    },
    options: { description: 'Select options' },
    isDisabled: { description: 'Is select field disabled' },
    isClearable: { description: 'Is select field clearable' },
    isSearchable: { description: 'Is select field searchable' },
    isMulti: { description: 'Can select field select multiple options' },
    required: { description: 'Is select field required' },
    hasError: { description: 'Does select field has error' },
    errorMessage: {
      description: 'Error message description',
      control: { type: 'text' },
    },
    icon: { description: 'Icon name' },
  },
}

export default config
type SelectProps = StoryObj<typeof Select>

const Template = (args) => (
  <div style={{ height: 150, overflow: 'auto' }}>
    <Select {...args} />
  </div>
)

export const Default: SelectProps = Template.bind({})
Default.args = {
  name: 'Select',
  label: 'Select label text',
  placeholder: 'Text',
  noOptionsMessage: 'No options',
  options: [
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
  ],
  backgroundColor: 'white',
  size: 'md',
  isDisabled: false,
  isClearable: false,
  isSearchable: false,
  isMulti: false,
  hasError: false,
  required: false,
  errorMessage: undefined,
  icon: undefined,
}

export const BlueBackground = Template.bind({})
BlueBackground.args = {
  ...Default.args,
  backgroundColor: 'blue',
}

export const NoOptions = Template.bind({})
NoOptions.args = {
  ...Default.args,
  options: [],
  noOptionsMessage: 'No options',
}

export const Multiple = Template.bind({})
Multiple.args = {
  ...Default.args,
  isMulti: true,
}

export const SizeSm = Template.bind({})
SizeSm.args = {
  ...Default.args,
  size: 'sm',
}

export const SizeXs = Template.bind({})
SizeXs.args = {
  ...Default.args,
  size: 'xs',
}

export const Disabled = Template.bind({})
Disabled.args = {
  ...Default.args,
  isDisabled: true,
}

export const Clearable = Template.bind({})
Clearable.args = {
  ...Default.args,
  isClearable: true,
}

export const Searchable = Template.bind({})
Searchable.args = {
  ...Default.args,
  isSearchable: true,
  placeholder: 'Type to search',
}

export const WithDifferentIcon = Template.bind({})
WithDifferentIcon.args = {
  ...Default.args,
  icon: 'ellipsisVertical',
}

export const Required = Template.bind({})
Required.args = {
  ...Default.args,
  required: true,
}

export const HasError = Template.bind({})
HasError.args = {
  ...Default.args,
  hasError: true,
  errorMessage: 'This is an error message',
}
