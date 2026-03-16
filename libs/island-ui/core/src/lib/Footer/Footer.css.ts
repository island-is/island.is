import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const withDecorator = style({})

export const bottomBar = style({})

export const topLinksContainer = style({
  marginTop: '44px',
})

export const bottomBarLinkUnderline = style({
  textDecoration: 'underline',
})

export const columnTopSpace = style({
  paddingTop: '18px',
})

export const topLinksGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      gap: '12px',
    },
  },
})

export const middleLinksGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '24px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      gap: '4px',
    },
  },
})
