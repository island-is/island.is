import React from 'react'
import { Typography } from './Typography'
import { select } from '@storybook/addon-knobs'
import { Colors } from '@island.is/island-ui/theme'
import { VariantTypes } from './Typography.treat'

export default {
  title: 'Components/Typography',
  component: Typography,
}

const makeDefaultComponent = (text = '') => {
  const variantOptions = [
    'p',
    'pSmall',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'intro',
    'eyebrow',
    'tag',
    'cardCategoryTitle',
    'sideMenu',
    'placeholderText',
    'datepickerHeaderText',
    'formProgressSection',
    'formProgressSectionActive',
  ]

  const variant = select('Variants', variantOptions, 'p') as VariantTypes

  const colorOptions = [
    'blue600',
    'blue400',
    'blue300',
    'blue200',
    'blue100',
    'dark400',
    'dark300',
    'dark200',
    'dark100',
    'red600',
    'red400',
    'red300',
    'red200',
    'red100',
    'white',
    'blueberry600',
    'blueberry400',
    'blueberry300',
    'blueberry200',
    'blueberry100',
    'purple600',
    'purple400',
    'purple300',
    'purple200',
    'purple100',
    'roseTinted600',
    'roseTinted400',
    'roseTinted300',
    'roseTinted200',
    'roseTinted100',
    'mint600',
    'mint400',
    'mint200',
    'mint300',
    'mint100',
    'yellow600',
    'yellow400',
    'yellow200',
    'yellow300',
    'yellow100',
    'transparent',
    'currentColor',
  ]

  const color = select('Colors', colorOptions, 'dark400') as Colors

  return (
    <Typography variant={variant} color={color}>
      {text}
    </Typography>
  )
}

const makeSpacingComponent = (text = '') => {
  const paddingY = select('Padding Y', [0, 1, 2, 3, 4, 5], 1)
  const paddingTop = select('Padding Top', [0, 1, 2, 3, 4, 5], undefined)
  const paddingBottom = select('Padding Bottom', [0, 1, 2, 3, 4, 5], undefined)

  return (
    <Typography
      variant="h3"
      paddingY={paddingY}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
    >
      {text}
    </Typography>
  )
}

export const Default = () => makeDefaultComponent('Choose a variant')
export const Spacing = () =>
  makeSpacingComponent('Typography is a layout component and can control vertical spacing')
