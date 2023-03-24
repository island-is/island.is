import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Input } from './Input'

export default {
  title: 'Form/Input',
  component: Input,
  parameters: withFigma('Input'),
}

const Template = (args) => <Input {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Tegund fyrirtækis',
  placeholder: 'This is the placeholder',
  name: 'Test1',
}

export const Tooltip = Template.bind({})
Tooltip.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test2',
  tooltip:
    'Bacon ipsum dolor amet ball tip leberkas pork belly pork chop, meatloaf swine jerky doner andouille tenderloin',
}

export const Error = Template.bind({})
Error.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test3',
  hasError: true,
  errorMessage: 'This is the error message',
}

export const Required = Template.bind({})
Required.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test4',
  required: true,
}

export const Textarea = Template.bind({})
Textarea.args = {
  label: 'Textarea label',
  placeholder: 'This is the placeholder',
  name: 'Test5',
  textarea: true,
  rows: 4,
}

export const Textarea10Rows = Template.bind({})
Textarea10Rows.args = {
  label: 'Textarea label',
  placeholder: 'This is the placeholder',
  name: 'Test6',
  textarea: true,
  rows: 10,
}

export const TextareaError = Template.bind({})
TextareaError.args = {
  label: 'Textarea label',
  placeholder: 'This is the placeholder',
  name: 'Test7',
  hasError: true,
  errorMessage: 'This is the error message',
  textarea: true,
  rows: 4,
}

export const TextareaRequired = Template.bind({})
TextareaRequired.args = {
  label: 'Textarea label',
  placeholder: 'This is the placeholder',
  name: 'Test8',
  required: true,
  textarea: true,
  rows: 4,
}

export const BlueBackgroundColor = Template.bind({})
BlueBackgroundColor.args = {
  label: 'This is the label',
  placeholder: 'Blue background',
  name: 'Test9',
  backgroundColor: 'blue',
}

export const ResponsiveBackgroundColor = Template.bind({})
ResponsiveBackgroundColor.args = {
  label: 'This is the label',
  placeholder: 'Try change the window size',
  name: 'Test10',
  backgroundColor: ['white', 'blue', 'white', 'blue', 'white'],
}

export const WithLabelAbove = Template.bind({})
WithLabelAbove.args = {
  label: 'This is the above label',
  placeholder: 'This is the placeholder',
  name: 'Test11',
  size: 'xs',
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test12',
  disabled: true,
}

export const ReadOnly = Template.bind({})
ReadOnly.args = {
  label: 'Read only label',
  placeholder: 'Read only',
  name: 'Test13',
  backgroundColor: 'blue',
  readOnly: true,
  value: 'Read only have a transparent background',
  icon: { name: 'copy', type: 'outline', onClick: () => console.log('Copy value') },
}

export const RightAligned = Template.bind({})
RightAligned.args = {
  label: 'Input Text is right aligned',
  placeholder: 'This is the placeholder',
  name: 'Test14',
  backgroundColor: 'blue',
  rightAlign: true,
}

export const CopyPasswordButton = (args) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const ref = React.useRef<HTMLInputElement>(null)
  const handleCopy = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!ref.current) return

    ref.current.select()
    document.execCommand('copy')
    if (ev.target instanceof HTMLElement) {
      ev.target.focus()
    }

    // Maybee trigger a toast here.
    console.log('Copy value', ref.current.value)
  }

  const handleShow = () => {
    setShowPassword(!showPassword)
  }

  return <Input ref={ref} {...args} icon={[
    { name: 'copy', type: 'outline', onClick: handleCopy, label: 'Copy value' },
    { name: showPassword ? 'eyeOff' : 'eye', onClick: handleShow, label: showPassword ? 'Hide password' : 'Show password' }
  ]}
    type={showPassword ? 'text' : 'password'}
  />
}
CopyPasswordButton.args = {
  label: 'Read only label',
  name: 'Test15',
  readOnly: true,
  value: 'AStingThatShouldBeCopied',
}

export const ButtonsWithAnError = Template.bind({})
ButtonsWithAnError.args = {
  label: 'Label',
  placeholder: 'This is the placeholder',
  name: 'Test17',
  errorMessage: 'This is the error message',
  icon: [
    { name: 'copy', type: 'outline', onClick: () => console.log('Copy value') },
    { name: 'eye', onClick: () => console.log('Show'), label: 'Show password' }
  ],
}

export const IconAndButton = Template.bind({})
IconAndButton.args = {
  label: 'Label',
  placeholder: 'This is the placeholder',
  name: 'Test16',
  errorMessage: 'This is the error message',
  icon: [
    { name: 'copy', type: 'outline', onClick: () => console.log('Copy value'), label: 'Copy value', disabled: true },
    { name: 'informationCircle' }
  ],
}

export const SmallWithIconAndButton = Template.bind({})
SmallWithIconAndButton.args = {
  label: 'Label',
  placeholder: 'This is the placeholder',
  name: 'Test18',
  size: 'sm',
  backgroundColor: 'blue',
  icon: [
    { name: 'informationCircle' },
    { name: 'eye', onClick: () => console.log('Show'), label: 'Show password', disabled: true, },
    { name: 'copy', type: 'outline', onClick: () => console.log('Copy value'), label: 'Copy value' },
  ],
}
export const ExtraSmallWithIconAndButton = Template.bind({})
ExtraSmallWithIconAndButton.args = {
  label: 'Label',
  placeholder: 'This is the placeholder',
  name: 'Test19',
  size: 'xs',
  icon: [
    { name: 'informationCircle' },
    { name: 'eye', onClick: () => console.log('Show'), label: 'Show password' },
    { name: 'copy', type: 'outline', onClick: () => console.log('Copy value'), label: 'Copy value' },
  ],
}

export const LabelDisabledEmpty = Template.bind({})
LabelDisabledEmpty.args = {
  label: 'LabelDisabledEmpty',
  placeholder: 'This is the placeholder',
  name: '20',
  size: 'sm',
}
