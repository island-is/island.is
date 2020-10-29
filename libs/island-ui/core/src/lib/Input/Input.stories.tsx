import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { Input } from './Input'
import { Box } from '../Box/Box'
import { ContentBlock } from '../ContentBlock/ContentBlock'

export default {
  title: 'Form/Input',
  component: Input,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=42%3A1688',
    mobile:
      'https://www.figma.com/file/rU3mPM1cLfHa3u7TWuutPQ/UI-Library-%E2%80%93-%F0%9F%93%B1Mobile?node-id=1%3A8',
  }),
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
