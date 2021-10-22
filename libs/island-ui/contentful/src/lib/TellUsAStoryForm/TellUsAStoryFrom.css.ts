import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const topImage = style({
  marginTop: 'auto',
  marginBottom: '-8%',
  width: '100%',
})

export const contentImage = style({
  maxWidth: '200px',
})

export const alignSelfCenter = style({
  alignSelf: 'center',
})

export const justifyContentFlexEnd = style({
  display: 'flex',
  justifyContent: 'flex-end',
})

export const infoImageWrapper = style({
  position: 'relative',
})
export const infoImage = style({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      transform: 'translate(0%, 50%)',
    },
  },
})
