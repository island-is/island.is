import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Input } from './Input'
import type { Meta, StoryObj } from '@storybook/react'

const config: Meta<typeof Input> = {
  title: 'Form/Input',
  component: Input,
  parameters: withFigma('Input'),
  argTypes: {
    name: { description: 'Field name' },
    label: { description: 'Label text', control: { type: 'text' } },
    placeholder: { description: 'Placeholder text' },
    type: {
      description: 'Input type',
      options: ['text', 'number', 'email', 'tel', 'password'],
      control: { type: 'radio' },
    },
    backgroundColor: {
      description: 'Background color',
      options: ['white', 'blue'],
      control: { type: 'radio' },
      defaultValue: 'white',
    },
    size: {
      description: 'Field size',
      options: ['xs', 'sm', 'md'],
      control: { type: 'radio' },
    },
    disabled: { description: 'Is input field disabled' },
    hasError: { description: 'Does input field has error' },
    errorMessage: { description: 'Error message', control: { type: 'text' } },
    required: { description: 'Is input field required' },
    readOnly: { description: 'Is input field readonly' },
    rightAlign: { description: 'Is text right aligned' },
    textarea: { description: 'Is input field textarea' },
    rows: {
      description: 'How many rows does Textarea consist of',
      control: { type: 'number' },
    },
    icon: { description: 'Field icon' },
    buttons: { description: 'Field buttons' },
    tooltip: { description: 'Field tooltip', control: { type: 'text' } },
    maxLength: {
      description: 'Maximum length of the input field',
      control: { type: 'number' },
    },
  },
}

export default config
type InputProps = StoryObj<typeof Input>

const Template = (args) => <Input {...args} />

export const Default: InputProps = Template.bind({})
Default.args = {
  name: 'Input',
  label: 'Input label text',
  placeholder: 'Text',
  type: undefined,
  backgroundColor: 'white',
  size: 'md',
  disabled: false,
  hasError: false,
  required: false,
  readOnly: false,
  rightAlign: false,
  textarea: false,
  rows: undefined,
  icon: undefined,
  buttons: undefined,
  tooltip: undefined,
  maxLength: undefined,
}

export const BlueBackground: InputProps = Template.bind({})
BlueBackground.args = {
  ...Default.args,
  backgroundColor: 'blue',
}

export const Disabled: InputProps = Template.bind({})
Disabled.args = {
  ...Default.args,
  disabled: true,
}

export const HasError: InputProps = Template.bind({})
HasError.args = {
  ...Default.args,
  hasError: true,
  errorMessage: 'This is the error message',
}

export const Required: InputProps = Template.bind({})
Required.args = {
  ...Default.args,
  required: true,
}

export const Readonly: InputProps = Template.bind({})
Readonly.args = {
  ...Default.args,
  readOnly: true,
}

export const TypeNumber: InputProps = Template.bind({})
TypeNumber.args = {
  ...Default.args,
  type: 'number',
}

export const Textarea: InputProps = Template.bind({})
Textarea.args = {
  ...Default.args,
  textarea: true,
  rows: 7,
}

export const ResponsiveBackgroundColor: InputProps = Template.bind({})
ResponsiveBackgroundColor.args = {
  ...Default.args,
  placeholder: 'Try change the window size',
  backgroundColor: ['white', 'blue', 'white', 'blue', 'white'],
}

export const SizeSm: InputProps = Template.bind({})
SizeSm.args = {
  ...Default.args,
  size: 'sm',
}

export const SizeXs: InputProps = Template.bind({})
SizeXs.args = {
  ...Default.args,
  size: 'xs',
}

export const TextRightAligned: InputProps = Template.bind({})
TextRightAligned.args = {
  ...Default.args,
  rightAlign: true,
}

export const WithIcon: InputProps = Template.bind({})
WithIcon.args = {
  ...Default.args,
  icon: { name: 'informationCircle' },
}

export const WithButtons: InputProps = Template.bind({})
WithButtons.args = {
  ...Default.args,
  buttons: [
    {
      label: 'Copy',
      name: 'copy',
      type: 'outline',
      onClick: () => console.log('Copy'),
    },
    {
      label: 'Close',
      name: 'close',
      type: 'outline',
      onClick: () => console.log('Close'),
    },
  ],
}

export const WithMaxLength10: InputProps = Template.bind({})
WithMaxLength10.args = {
  ...Default.args,
  maxLength: 10,
}

export const WithTooltip: InputProps = Template.bind({})
WithTooltip.args = {
  ...Default.args,
  tooltip: 'Tooltip text',
}

export const WithCopyPasswordButton: InputProps = (args) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const ref = React.useRef<HTMLInputElement>(null)
  const handleCopy = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!ref.current) return

    ref.current.select()
    document.execCommand('copy')
    if (ev.target instanceof HTMLElement) {
      ev.target.focus()
    }

    console.log('Copy value', ref.current.value)
  }

  const handleShow = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Input
      ref={ref}
      {...args}
      type={showPassword ? 'text' : 'password'}
      buttons={[
        {
          name: 'copy',
          type: 'outline',
          onClick: handleCopy,
          label: 'Copy value',
        },
        {
          name: showPassword ? 'eyeOff' : 'eye',
          onClick: handleShow,
          label: showPassword ? 'Hide password' : 'Show password',
        },
      ]}
    />
  )
}
WithCopyPasswordButton.args = {
  ...Default.args,
  readOnly: true,
  value: 'StringThatShouldBeCopied',
}
