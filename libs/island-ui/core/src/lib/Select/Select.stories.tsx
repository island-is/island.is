import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Select } from './Select'

export default {
  title: 'Form/Select',
  component: Select,
  parameters: withFigma('Select'),
}

const Template = (args) => <Select {...args} />

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
}

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
