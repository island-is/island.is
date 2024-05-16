import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Select } from './Select'
import type { Meta, StoryObj } from '@storybook/react'
import { PropsBase } from './Select.types'

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
    hasError: { description: 'Does select field has error' },
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
  noOptionsMessage: 'Enginn valmöguleiki',
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
  //backgroundColor: 'white',
  //size: 'md',
  isDisabled: false,
  isClearable: false,
  isSearchable: false,
  //hasError: false,
}

export const BlueBackground = Template.bind({})
BlueBackground.args = {
  ...Default.args,
  backgroundColor: 'blue',
}

export const NoOptions = Template.bind({})
NoOptions.args = {
  ...Default.args,
  noOptionsMessage: 'Enginn valmöguleiki',
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
}

export const WithError = Template.bind({})
WithError.args = {
  ...Default.args,
  hasError: true,
}
