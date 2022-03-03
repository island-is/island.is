import { globalStyle,style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const buttonWrapper = style({})

globalStyle(`${buttonWrapper} > button`, {
  width: '100%',
  justifyContent: 'center',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      justifyContent: 'flex-start',
    },
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      justifyContent: 'center',
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      justifyContent: 'flex-start',
    },
  },
})
