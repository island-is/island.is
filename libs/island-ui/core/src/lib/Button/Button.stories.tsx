import React from 'react'
import { withFigma } from '../../utils/withFigma'

import { Box } from '../Box/Box'
import { Button, ButtonBaseProps } from './Button'
import type { Meta, StoryObj } from '@storybook/react'

const config: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  parameters: withFigma('Button'),
  argTypes: {
    children: { description: 'Button text', control: { type: 'text' } },
    size: {
      description: 'Button size',
      control: { type: 'radio' },
      options: ['default', 'small', 'large'],
    },
    variant: {
      description: 'Button variant',
      control: {
        type: 'radio',
      },
      options: ['primary', 'ghost', 'text', 'utility'],
    },
    icon: { description: 'Icon' },
    iconType: {
      description: 'Icon type',
      control: { type: 'radio' },
      options: ['filled', 'outlined'],
    },
    preTextIcon: { description: 'Icon at the start of the button' },
    preTextIconType: {
      description: 'Icon type at the start of the button',
      control: { type: 'radio' },
      options: ['filled', 'outlined'],
    },
    fluid: { description: 'Button fluid' },
    disabled: { description: 'Is button disabled' },
    loading: { description: 'Is button loading' },
    colorScheme: {
      description: 'Button color scheme',
      control: { type: 'radio' },
      options: ['default', 'destructive', 'negative'],
    },
    circle: { description: 'Is it a circle button' },
    onClick: { description: 'Button click handler' },
    onBlur: { description: 'Button blur handler' },
    onFocus: { description: 'Button focus handler' },
  },
}

export default config
type ButtonProps = StoryObj<ButtonBaseProps>

const Template = (args) => <Button {...args} />

export const Default: ButtonProps = Template.bind({})
Default.args = {
  children: 'Button',
  size: 'default',
  variant: 'primary',
  fluid: false,
  disabled: false,
  loading: false,
  circle: false,
  colorScheme: 'default',
  icon: undefined,
  iconType: 'filled',
  preTextIcon: undefined,
  preTextIconType: 'filled',
}

export const Ghost: ButtonProps = Template.bind({})
Ghost.args = { ...Default.args, variant: 'ghost' }

export const Text: ButtonProps = Template.bind({})
Text.args = {
  ...Default.args,
  variant: 'text',
  circle: undefined,
}

export const Utility: ButtonProps = Template.bind({})
Utility.args = {
  ...Default.args,
  variant: 'utility',
  circle: undefined,
}

export const Fluid: ButtonProps = Template.bind({})
Fluid.args = { ...Default.args, fluid: true }

export const Disabled: ButtonProps = Template.bind({})
Disabled.args = { ...Default.args, disabled: true }

export const Loading: ButtonProps = Template.bind({})
Loading.args = { ...Default.args, loading: true }

export const CircleButton: ButtonProps = Template.bind({})
CircleButton.args = {
  circle: true,
  icon: 'arrowForward',
  title: 'Go forward',
}

export const SizeSmall: ButtonProps = Template.bind({})
SizeSmall.args = { ...Default.args, size: 'small' }

export const SizeLarge: ButtonProps = Template.bind({})
SizeLarge.args = { ...Default.args, size: 'large' }

export const ColorSchemeDestructive: ButtonProps = Template.bind({})
ColorSchemeDestructive.args = {
  ...Default.args,
  colorScheme: 'destructive',
}

export const ColorSchemeNegative: React.FC<
  React.PropsWithChildren<ButtonProps>
> = () => (
  <Box background="blue400" padding={4}>
    <Button colorScheme="negative">Button</Button>
  </Box>
)

export const WithIcon: ButtonProps = Template.bind({})
WithIcon.args = {
  ...Default.args,
  icon: 'arrowForward',
}

export const WithIconPreText: ButtonProps = Template.bind({})
WithIconPreText.args = {
  ...Default.args,
  preTextIcon: 'arrowBack',
}

export const WithFilledIcon: ButtonProps = Template.bind({})
WithFilledIcon.args = {
  ...Default.args,
  icon: 'calendar',
  iconType: 'filled',
}
