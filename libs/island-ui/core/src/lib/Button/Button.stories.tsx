import React from 'react'
import { Button, ButtonSize, ButtonVariant } from './Button'
import { boolean, select } from '@storybook/addon-knobs'

export default {
  title: 'Components/Button',
  component: Button,
}

const makeButton = (variant: ButtonVariant = 'normal', text = '') => {
  const label = 'Size'
  const options = ['small', 'medium', 'large']
  const defaultValue = 'medium'

  const size: string = select(label, options, defaultValue)
  const selectedSize: ButtonSize = size as ButtonSize

  const disabled = boolean('Disabled', false)

  return (
    <Button disabled={disabled} size={selectedSize} variant={variant}>
      {text}
    </Button>
  )
}

export const Normal = () => makeButton('normal', 'Normal button')
export const Ghost = () => makeButton('ghost', 'Ghost button')
export const Text = () => makeButton('text', 'Text button')
