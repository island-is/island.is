import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { Input } from '../Input/Input'
import { Select } from './Select'

export default {
  title: 'Form/Select',
  component: Select,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=50%3A101',
  }),
}

export const TempTest = () => (
  <div style={{ height: 600 }}>
    <Input name="test" label="tester input" placeholder="placeholder test" />
    <div style={{ height: 30 }} />
    <Template
      name="select"
      label="tester select"
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
          value: '2',
        },
      ]}
    />
  </div>
)

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
