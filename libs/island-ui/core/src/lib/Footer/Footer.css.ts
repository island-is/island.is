import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const withDecorator = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      borderRight: `1px solid ${theme.color.blue200}`,
    },
  },
})

export const iconPaddingTop = style({
  paddingTop: '3px',
})

export const bottomBar = style({
  borderTop: `1px solid ${theme.color.blue200}`,
})

export const topLinksContainer = style({
  marginTop: '44px',
})

export const bottomBarLinkUnderline = style({
  textDecoration: 'underline',
})

export const middleLinksGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '4px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
})
