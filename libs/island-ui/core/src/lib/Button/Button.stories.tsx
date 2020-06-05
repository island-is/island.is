import React from 'react'
import { Button, ButtonSize, ButtonVariant } from './Button'
import { Box, Inline } from '../..'
import { IconTypes } from '../Icon/Icon'
import { boolean, select } from '@storybook/addon-knobs'

import avatarImage from '../../assets/avatar.jpg'

export default {
  title: 'Components/Button',
  component: Button,
}

const makeButton = (variant: ButtonVariant = 'normal', text = '') => {
  const sizeLabel = 'Size'
  const sizeOptions = ['small', 'medium', 'large']
  const sizeDefaultValue = 'medium'

  const size: string = select(sizeLabel, sizeOptions, sizeDefaultValue)
  const selectedSize: ButtonSize = size as ButtonSize

  const iconLabel = 'Icon'
  const iconOptions = ['', 'cheveron', 'loading', 'external', 'arrowRight']
  const iconDefaultValue = ''

  const icon: string = select(iconLabel, iconOptions, iconDefaultValue)
  const selectedicon: IconTypes = icon as IconTypes

  const disabled = boolean('Disabled', false)
  const loading = boolean('Loading', false)

  return (
    <Box padding={2}>
      <Button
        disabled={disabled}
        size={selectedSize}
        variant={variant}
        icon={selectedicon}
        loading={loading}
      >
        {text}
      </Button>
    </Box>
  )
}

const makeMenuButton = (text = '', props) => {
  const iconLabel = 'Icon'
  const iconOptions = ['', 'cheveron', 'loading', 'external', 'arrow']
  const iconDefaultValue = 'cheveron'

  const icon: string = select(iconLabel, iconOptions, iconDefaultValue)
  const selectedicon: IconTypes = icon as IconTypes

  const disabled = boolean('Disabled', false)
  const loading = boolean('Loading', false)

  return (
    <Button
      disabled={disabled}
      variant="menu"
      icon={selectedicon}
      loading={loading}
      {...props}
    >
      {text}
    </Button>
  )
}

export const Normal = () => makeButton('normal', 'Normal button')
export const Ghost = () => makeButton('ghost', 'Ghost button')
export const Text = () => makeButton('text', 'Text button')
export const Menu = () => makeButton('menu', 'Text button')
export const MenuVariations = () => {
  const menuButtons = [
    () => makeMenuButton('Icon button', { leftIcon: 'user' }),
    () => makeMenuButton('Image button', { leftImage: avatarImage }),
  ]

  return (
    <Box padding={2}>
      <Inline space={2}>
        {menuButtons.map((Cmp, index) => (
          <Cmp key={index} />
        ))}
      </Inline>
    </Box>
  )
}
