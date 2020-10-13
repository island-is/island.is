import React from 'react'
import { Box } from '../..'
import { Button } from './Button'

export default {
  title: 'Core/ButtonRC',
  component: Button,
  argTypes: {
    onClick: { action: 'onClick' },
    onBlur: { action: 'onBlur' },
    onFocus: { action: 'onFocus' },
  },
  parameters: {
    docs: {
      description: {
        component:
          '[View in Figma](https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=2%3A170)',
      },
    },
  },
}

const Template = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = { children: 'Primary Button' }

export const PrimarySmall = Template.bind({})
PrimarySmall.args = { children: 'Primary Button Small', size: 'small' }

export const PrimaryLarge = Template.bind({})
PrimaryLarge.args = { children: 'Primary Button Large', size: 'large' }

export const PrimaryDestructive = Template.bind({})
PrimaryDestructive.args = {
  children: 'Primary Button Destructive',
  colorScheme: 'destructive',
}

export const PrimaryNegative = () => (
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
  icon: 'arrowRight',
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
  icon: 'arrowRight',
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
  <Button variant="text" icon="arrowRight">
    Text button with long text that
    <br />
    breaks down into multiple lines
  </Button>
)

export const Circle = Template.bind({})
Circle.args = {
  circle: true,
  icon: 'arrowRight',
}

export const CircleSmall = Template.bind({})
CircleSmall.args = {
  circle: true,
  icon: 'arrowRight',
  size: 'small',
}

export const CircleLarge = Template.bind({})
CircleLarge.args = {
  circle: true,
  icon: 'arrowRight',
  size: 'large',
}

export const CircleDestructive = Template.bind({})
CircleDestructive.args = {
  circle: true,
  icon: 'arrowRight',
  colorScheme: 'destructive',
}

export const CircleNegative = () => (
  <Box background="blue400" padding={4}>
    <Button colorScheme="negative" circle icon="arrowRight" />
  </Box>
)

export const CircleGhost = Template.bind({})
CircleGhost.args = {
  circle: true,
  variant: 'ghost',
  icon: 'arrowRight',
}

export const CircleGhostSmall = Template.bind({})
CircleGhostSmall.args = {
  circle: true,
  variant: 'ghost',
  icon: 'arrowRight',
  size: 'small',
}

export const CircleGhostLarge = Template.bind({})
CircleGhostLarge.args = {
  circle: true,
  variant: 'ghost',
  icon: 'arrowRight',
  size: 'large',
}

export const CircleGhostDestructive = Template.bind({})
CircleGhostDestructive.args = {
  circle: true,
  variant: 'ghost',
  icon: 'arrowRight',
  colorScheme: 'destructive',
}
export const CircleGhostNegative = () => (
  <Box background="blue400" padding={4}>
    <Button variant="ghost" colorScheme="negative" circle icon="arrowRight" />
  </Box>
)

export const Utility = Template.bind({})
Utility.args = {
  children: 'Utility Button',
  variant: 'utility',
  icon: 'arrowRight',
}

export const UtilityDestructive = Template.bind({})
UtilityDestructive.args = {
  children: 'Utility Button',
  variant: 'utility',
  colorScheme: 'destructive',
  icon: 'globe',
}

export const UtilityNegative = () => (
  <Box background="blue400" padding={4}>
    <Button variant="utility" colorScheme="negative" icon="arrowRight">
      Utility Button
    </Button>
  </Box>
)
