import React from 'react'
import Button, { ButtonSize, ButtonVariant } from './Button'
import { boolean, select } from '@storybook/addon-knobs'

export default {
  title: 'Components/Button',
  component: Button,
}

const makeButton = (variant: ButtonVariant = 'default') => {
  const label = 'Size'
  const options = ['normal', 'large']
  const defaultValue = 'normal'

  const size: string = select(label, options, defaultValue)
  const selectedSize: ButtonSize = size as ButtonSize

  const disabled = boolean('Disabled', false)

  return (
    <Button disabled={disabled} size={selectedSize} variant={variant}>
      Default button
    </Button>
  )
}

export const Normal = () => makeButton()
export const Ghost = () => makeButton('ghost')
export const Text = () => (
  <Button disabled={boolean('Disabled', false)} variant="text">
    Text button
  </Button>
)
