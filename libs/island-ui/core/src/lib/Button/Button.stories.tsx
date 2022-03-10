import React from 'react'
import { withFigma } from '../../utils/withFigma'

import { Box } from '../Box/Box'
import { Button } from './Button'

export default {
  title: 'Core/Button',
  component: Button,
  argTypes: {
    onClick: { action: 'onClick' },
    onBlur: { action: 'onBlur' },
    onFocus: { action: 'onFocus' },
  },
  parameters: withFigma('Button'),
}

const Template = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = { children: 'Primary Button' }

export const DefaultSmall = Template.bind({})
DefaultSmall.args = { children: 'Primary Button Small', size: 'small' }

export const DefaultLarge = Template.bind({})
DefaultLarge.args = { children: 'Primary Button Large', size: 'large' }

export const DefaultDestructive = Template.bind({})
DefaultDestructive.args = {
  children: 'Primary Button Destructive',
  colorScheme: 'destructive',
}

export const DefaultNegative = () => (
  <Box background="blue400" padding={4}>
    <Button colorScheme="negative">Negative button</Button>
  </Box>
)

export const Ghost = Template.bind({})
Ghost.args = { variant: 'ghost', children: 'Ghost Button' }

export const GhostSmall = Template.bind({})
GhostSmall.args = {
  variant: 'ghost',
  children: 'Ghost Button Small',
  size: 'small',
}

export const GhostLarge = Template.bind({})
GhostLarge.args = {
  variant: 'ghost',
  children: 'Ghost Button Large',
  size: 'large',
}

export const GhostDestructive = Template.bind({})
GhostDestructive.args = {
  children: 'Ghost Button Destructive',
  variant: 'ghost',
  colorScheme: 'destructive',
}

export const GhostWithIcon = Template.bind({})
GhostWithIcon.args = {
  children: 'Ghost With Icon',
  variant: 'ghost',
  icon: 'arrowForward',
}

export const GhostWithIconPositionStart = Template.bind({})
GhostWithIconPositionStart.args = {
  children: 'Ghost With Icon',
  variant: 'ghost',
  preTextIcon: 'arrowBack',
}

export const GhostNegative = () => (
  <Box background="blue400" padding={4}>
    <Button colorScheme="negative" variant="ghost">
      Negative button
    </Button>
  </Box>
)

export const Text = Template.bind({})
Text.args = {
  children: 'Text Button',
  variant: 'text',
}

export const TextSmall = Template.bind({})
TextSmall.args = {
  children: 'Text Button',
  variant: 'text',
  size: 'small',
}

export const TextLarge = Template.bind({})
TextLarge.args = {
  children: 'Text Button',
  variant: 'text',
  size: 'large',
}

export const TextDestructiveWithIcon = Template.bind({})
TextDestructiveWithIcon.args = {
  children: 'Text destructive',
  variant: 'text',
  colorScheme: 'destructive',
}

export const TextWithIcon = Template.bind({})
TextWithIcon.args = {
  children: 'Text with icon',
  variant: 'text',
  icon: 'arrowForward',
}

export const TextWithIconPositionStart = Template.bind({})
TextWithIconPositionStart.args = {
  children: 'Text with icon',
  variant: 'text',
  preTextIcon: 'arrowBack',
}

export const TextNegative = () => (
  <Box background="blue400" padding={4}>
    <Button colorScheme="negative" variant="text">
      Text Negative
    </Button>
  </Box>
)

export const TextMultiline = () => (
  <Button variant="text">
    Text button with long text that
    <br />
    breaks down into multiple lines
  </Button>
)

export const TextMultilineWithIcon = () => (
  <Button variant="text" icon="arrowForward">
    Text button with long text that
    <br />
    breaks down into multiple lines
  </Button>
)

export const Circle = Template.bind({})
Circle.args = {
  circle: true,
  icon: 'arrowForward',
  title: 'Go forward',
}

export const CircleSmall = Template.bind({})
CircleSmall.args = {
  circle: true,
  icon: 'arrowForward',
  size: 'small',
  title: 'Go forward',
}

export const CircleLarge = Template.bind({})
CircleLarge.args = {
  circle: true,
  icon: 'arrowForward',
  size: 'large',
  title: 'Go forward',
}

export const CircleDestructive = Template.bind({})
CircleDestructive.args = {
  circle: true,
  icon: 'arrowForward',
  colorScheme: 'destructive',
}

export const CircleNegative = () => (
  <Box background="blue400" padding={4}>
    <Button colorScheme="negative" circle icon="arrowForward" />
  </Box>
)

export const CircleGhost = Template.bind({})
CircleGhost.args = {
  circle: true,
  variant: 'ghost',
  icon: 'arrowForward',
}

export const CircleGhostSmall = Template.bind({})
CircleGhostSmall.args = {
  circle: true,
  variant: 'ghost',
  icon: 'arrowForward',
  size: 'small',
}

export const CircleGhostLarge = Template.bind({})
CircleGhostLarge.args = {
  circle: true,
  variant: 'ghost',
  icon: 'arrowForward',
  size: 'large',
}

export const CircleGhostDestructive = Template.bind({})
CircleGhostDestructive.args = {
  circle: true,
  variant: 'ghost',
  icon: 'arrowForward',
  colorScheme: 'destructive',
}
export const CircleGhostNegative = () => (
  <Box background="blue400" padding={4}>
    <Button variant="ghost" colorScheme="negative" circle icon="arrowForward" />
  </Box>
)

export const Utility = Template.bind({})
Utility.args = {
  children: 'Utility Button',
  variant: 'utility',
  icon: 'arrowForward',
}

export const UtilityDestructive = Template.bind({})
UtilityDestructive.args = {
  children: 'Utility Button',
  variant: 'utility',
  colorScheme: 'destructive',
  icon: 'arrowForward',
}

export const UtilityNegative = () => (
  <Box background="blue400" padding={4}>
    <Button variant="utility" colorScheme="negative" icon="arrowForward">
      Utility Button
    </Button>
  </Box>
)
