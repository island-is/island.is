import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import covidColors from '../colors'

export const row = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md - 1}px)`]: {
      marginLeft: -24,
      marginRight: -24,
      backgroundColor: covidColors.green100,
      borderRadius: 0,
    },
  },
})

export const box = style({
  backgroundColor: covidColors.green100,
})

export const column = style({})

export const fixedContainer = style({
  zIndex: 100,
  background: covidColors.green100,
  boxShadow: '0px 4px 30px rgb(170, 225, 224)',
})
