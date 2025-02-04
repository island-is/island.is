import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
})

export const innerContainer = style({
  display: 'inline-flex',
  flexWrap: 'nowrap',
  transition: 'transform 0.3s ease',
})

export const slide = style({
  width: '100%',
})

export const dot = style({
  position: 'relative',
  display: 'inline-block',
  outline: 0,
  backgroundColor: theme.color.red200,
  borderRadius: 8,
  width: 8,
  height: 8,
  transition: `background-color 0.3s ease, width 0.3s ease`,
  ':after': {
    position: 'absolute',
    content: '""',
    left: -8,
    right: -8,
    top: -8,
    bottom: -8,
  },
})

export const dotActive = style({
  backgroundColor: theme.color.red400,
  width: 32,
  height: 8,
})

export const nav = style({
  position: 'absolute',
  top: 0,
  right: 0,
})
