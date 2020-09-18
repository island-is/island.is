import React from 'react'
import { Box } from './Box'
import { select } from '@storybook/addon-knobs'
import { Colors } from '@island.is/island-ui/theme'

export default {
  title: 'Components/Box',
  component: Box,
}

const makeBox = (text = '') => {
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

  const background = select(
    'Background color',
    colorOptions,
    'dark400',
  ) as Colors

  const availableSizes = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const

  const paddingY = select('Padding Y', availableSizes, 1)
  const paddingTop = select('Padding Top', availableSizes, undefined)
  const paddingBottom = select('Padding Bottom', availableSizes, undefined)
  const marginX = select('Margin X', availableSizes, undefined)
  const marginLeft = select('Margin Left', availableSizes, undefined)
  const marginRight = select('Margin Right', availableSizes, undefined)
  const marginY = select('Margin Y', availableSizes, undefined)
  const marginTop = select('Margin Top', availableSizes, undefined)
  const marginBottom = select('Margin Bottom', availableSizes, undefined)

  return (
    <Box
      background={background}
      paddingY={paddingY}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      marginX={marginX}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginY={marginY}
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      {text}
    </Box>
  )
}

export const Default = () =>
  makeBox(
    'Box is the primary layout component. See `Docs` tab for all available props.',
  )
