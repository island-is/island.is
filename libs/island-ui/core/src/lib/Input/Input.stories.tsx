import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Input } from './Input'
import { size } from 'lodash'
import { ro } from 'date-fns/locale'

export default {
  title: 'Form/Input',
  component: Input,
  parameters: withFigma('Input'),
  argTypes: {
    name: { description: 'Field name' },
    label: { description: 'Label text', control: { type: 'text' } },
    placeholder: { description: 'Placeholder text' },
    type: { description: 'Input type' },
    backgroundColor: {
      description: 'Background color',
      options: ['white', 'blue'],
      control: { type: 'radio' },
      defaultValue: 'white'
    },
    size: {
      description: 'Field size',
      options: ['xs', 'sm', 'md'],
      control: { type: 'radio' },
    },
    disabled: { description: 'Is input field disabled' },
    withError: { description: 'Does input field has error' },
    required: { description: 'Is input field required' },
    readonly: { description: 'Is input field readonly' },
    rightAlign: { description: 'Is text right aligned' },
    textarea: { description: 'Is input field textarea' },
    rows: { description: 'How many rows does Textarea consist of' },
    icon: { description: 'Field icon' },
    buttons: { description: 'Field buttons' },
  },
}

const Template = (args) => <Input {...args} />

const inputArgs = {
  name: 'Input',
  label: 'Input label text',
  placeholder: 'Text',
  type: 'text',
  backgroundColor: 'white',
  size: 'md',
  disabled: false,
  withError: false,
  required: false,
  readonly: false,
  rightAlign: false,
  textarea: false,
  rows: 7,
  icon: undefined,
  buttons: undefined,
}

export const Default = Template.bind({})
Default.args = inputArgs

export const BlueBackground = Template.bind({})
BlueBackground.args = {
  ...inputArgs,
  backgroundColor: 'blue',
}

export const Disabled = Template.bind({})
Disabled.args = {
  ...inputArgs,
  disabled: true,
}

export const WithError = Template.bind({})
WithError.args = {
  ...inputArgs,
  hasError: true,
  errorMessage: 'This is the error message',
}

export const Required = Template.bind({})
Required.args = {
  ...inputArgs,
  required: true,
}

export const Readonly = Template.bind({})
Readonly.args = {
  ...inputArgs,
  readonly: true,
}

export const TypeNumber = Template.bind({})
TypeNumber.args = {
  ...inputArgs,
  type: 'number',
}

export const Textarea = Template.bind({})
Textarea.args = {
  ...inputArgs,
  textarea: true,
  rows: 7,
}

export const ResponsiveBackgroundColor = Template.bind({})
ResponsiveBackgroundColor.args = {
  ...inputArgs,
  placeholder: 'Try change the window size',
  backgroundColor: ['white', 'blue', 'white', 'blue', 'white'],
}

export const SizeSm = Template.bind({})
SizeSm.args = {
  ...inputArgs,
  size: 'sm',
}

export const SizeXs = Template.bind({})
SizeXs.args = {
  ...inputArgs,
  size: 'xs',
}

export const TextRightAligned = Template.bind({})
TextRightAligned.args = {
  ...inputArgs,
  rightAlign: true,
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  ...inputArgs,
  icon: { name: 'informationCircle' },
}

export const WithButtons = Template.bind({})
WithButtons.args = {
  ...inputArgs,
  buttons: [
    { name: 'copy', type: 'outline', onClick: () => console.log('Copy') },
    { name: 'close', type: 'outline', onClick: () => console.log('Close') },
  ],
}

export const WithCopyPasswordButton = (args) => {
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
  ...inputArgs,
  readOnly: true,
  value: 'StringThatShouldBeCopied',
}
