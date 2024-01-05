import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Select } from './Select'
import { Option, SelectProps } from './Select.types'

export default {
  title: 'Form/Select',
  component: Select,
  parameters: withFigma('Select'),
}

const Template = (args: SelectProps<Option<string>>) => <Select {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'select1',
  label: 'Tegund fyrirtækis',
  placeholder: 'Veldu tegund',
  options: [
    {
      label: 'Valmöguleiki 1',
      value: '0',
    },
    {
      label: 'Valmöguleiki 2',
      value: '1',
    },
    {
      label: 'Valmöguleiki 3',
      value: '2',
    },
  ],
  noOptionsMessage: 'Enginn valmöguleiki',
} as SelectProps<Option<string>>

export const WithLabelAbove = Template.bind({})
WithLabelAbove.args = {
  name: 'select2',
  label: 'Tegund valmöguleika',
  placeholder: 'Veldu tegund',
  options: [
    {
      label: 'Valmöguleiki 1',
      value: '0',
    },
    {
      label: 'Valmöguleiki 2',
      value: '1',
    },
    {
      label: 'Valmöguleiki 3',
      value: '2',
    },
  ],
  size: 'xs',
  noOptionsMessage: 'Enginn valmöguleiki',
} as SelectProps<Option<string>>

export const NoOption = Template.bind({})
NoOption.args = {
  name: 'select2',
  label: 'Tegund valmöguleika',
  placeholder: 'Veldu tegund',
  options: [],
  size: 'xs',
  noOptionsMessage: 'Enginn valmöguleiki',
} as SelectProps<Option<string>>

export const Disabled = Template.bind({})
Disabled.args = {
  name: 'select3',
  label: 'Tegund fyrirtækis',
  placeholder: 'Veldu tegund',
  options: [
    {
      label: 'Valmöguleiki 1',
      value: '0',
    },
    {
      label: 'Valmöguleiki 2',
      value: '1',
    },
    {
      label: 'Valmöguleiki 3',
      value: '2',
    },
  ],
  noOptionsMessage: 'Enginn valmöguleiki',
  isDisabled: true,
} as SelectProps<Option<string>>

export const Creatable = Template.bind({})
Creatable.args = {
  name: 'creatableSelect',
  label: 'Color',
  placeholder: 'Choose a color',
  isCreatable: true,
  options: [
    {
      label: 'Yellow',
      value: 'yellow',
    },
    {
      label: 'Red',
      value: 'red',
    },
    {
      label: 'Green',
      value: 'green',
    },
    {
      label: 'Blue',
      value: 'blue',
    },
  ],
} as SelectProps<Option<string>>

export const Clearable = Template.bind({})
Clearable.args = {
  name: 'clearableSelect',
  label: 'Color',
  placeholder: 'Choose a color',
  isClearable: true,
  onChange: (option) =>
    console.log(`Selected value changed: ${option}`, { option }),
  options: [
    {
      label: 'Yellow',
      value: 'yellow',
    },
    {
      label: 'Red',
      value: 'red',
    },
    {
      label: 'Green',
      value: 'green',
    },
    {
      label: 'Blue',
      value: 'blue',
    },
  ],
} as SelectProps<Option<string>>

export const TempTest = () => (
  <div style={{ height: 900 }}>
    <h1>WIP</h1>
    <div style={{ height: 30 }} />
    <Template
      name="select"
      label="tester select"
      size="md"
      placeholder="placeholder test"
      options={[
        {
          label: 'Valmöguleiki 1',
          value: '0',
        },
        {
          label: 'Valmöguleiki 2',
          value: '1',
        },
        {
          label: 'Valmöguleiki 3',
          value: '3',
        },
        {
          label: 'Valmöguleiki 3',
          value: '4',
        },
        {
          label: 'Valmöguleiki 3',
          value: '5',
        },
        {
          label: 'Valmöguleiki 3',
          value: '6',
        },
      ]}
      noOptionsMessage="Enginn valmöguleiki"
    />
    <div style={{ height: 30 }} />
    <Template
      name="select"
      label="tester select"
      size="sm"
      placeholder="placeholder test"
      options={[
        {
          label: 'Valmöguleiki 1',
          value: '0',
        },
        {
          label: 'Valmöguleiki 2',
          value: '1',
        },
        {
          label: 'Valmöguleiki 3',
          value: '3',
        },
        {
          label: 'Valmöguleiki 3',
          value: '4',
        },
        {
          label: 'Valmöguleiki 3',
          value: '5',
        },
        {
          label: 'Valmöguleiki 3',
          value: '6',
        },
      ]}
      noOptionsMessage="Enginn valmöguleiki"
    />
    <div style={{ height: 30 }} />
    <Template
      name="select"
      label="tester select"
      size="sm"
      placeholder="placeholder test"
      options={[
        {
          label: 'Valmöguleiki 1',
          value: '0',
        },
        {
          label: 'Valmöguleiki 2',
          value: '1',
        },
        {
          label: 'Valmöguleiki 3',
          value: '3',
        },
        {
          label: 'Valmöguleiki 3',
          value: '4',
        },
        {
          label: 'Valmöguleiki 3',
          value: '5',
        },
        {
          label: 'Valmöguleiki 3',
          value: '6',
        },
      ]}
      noOptionsMessage="Enginn valmöguleiki"
      backgroundColor="blue"
    />
    <div style={{ height: 30 }} />
    <Template
      name="select"
      label="With groups"
      size="md"
      placeholder="placeholder test"
      menuIsOpen
      formatGroupLabel={() => <p>Custom group label</p>}
      options={[
        {
          label: 'Valmöguleiki 3',
          value: '4',
        },
        {
          label: 'Valmöguleiki 3',
          value: '5',
        },
        {
          label: 'Valmöguleiki 3',
          value: '6',
        },
        {
          label: 'group1',
          options: [
            {
              label: 'Valmöguleiki 1',
              value: '0',
            },
            {
              label: 'Valmöguleiki 2',
              value: '1',
            },
            {
              label: 'Valmöguleiki 3',
              value: '3',
            },
          ],
        },
      ]}
      noOptionsMessage="Enginn valmöguleiki"
    />
  </div>
)
