import React, { PropsWithChildren } from 'react'
import { withFigma } from '../../utils/withFigma'
import { PhoneInput, PhoneInputProps } from './PhoneInput'

export default {
  title: 'Form/PhoneInput',
  component: PhoneInput,
  parameters: withFigma('PhoneInput'),
  argTypes: {
    label: { control: 'text', defaultValue: 'Phone' },
    placeholder: { control: 'text', defaultValue: 'This is the placeholder' },
    size: {
      options: ['xs', 'sm', 'md'],
      defaultValue: 'md',
      control: { type: 'radio' },
    },
    backgroundColor: {
      options: ['white', 'blue'],
      control: { type: 'radio' },
      defaultValue: 'white',
    },
  },
}

const Wrap = ({ children }: PropsWithChildren<{}>) => (
  <div style={{ height: 400, position: 'relative', overflow: 'auto' }}>
    {children}
  </div>
)

export const Template = (args: PhoneInputProps) => (
  <Wrap>
    <PhoneInput size="md" label="Phone" name="Test1" {...args} />
  </Wrap>
)

export const Default = Template.bind({})
Default.args = {
  label: 'Phone',
  placeholder: 'This is the placeholder',
  name: 'Test2',
}

export const Tooltip = Template.bind({})
Tooltip.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test3',
  tooltip:
    'Bacon ipsum dolor amet ball tip leberkas pork belly pork chop, meatloaf swine jerky doner andouille tenderloin',
}

export const Required = Template.bind({})
Required.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test4',
  required: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test5',
  disabled: true,
}

export const Error = Template.bind({})
Error.args = {
  label: 'Phone',
  placeholder: 'This is the placeholder',
  name: 'Test6',
  hasError: true,
  errorMessage: 'This is the error message',
}

export const ReadOnly = Template.bind({})
ReadOnly.args = {
  label: 'Read only label',
  placeholder: 'Read only',
  name: 'Test7',
  backgroundColor: 'blue',
  readOnly: true,
}

export const WithLabelAbove = Template.bind({})
WithLabelAbove.args = {
  label: 'Phone',
  placeholder: 'This is the placeholder',
  name: 'Test8',
  size: 'xs',
}

export const Small = Template.bind({})
Small.args = {
  label: 'Phone',
  placeholder: 'This is the placeholder',
  name: 'Test9',
  size: 'sm',
}
