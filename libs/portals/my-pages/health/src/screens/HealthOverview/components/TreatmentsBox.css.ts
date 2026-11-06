import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const cardLink = style({
  display: 'block',
  textDecoration: 'none',
  borderRadius: theme.border.radius.large,
  ':focus-visible': {
    outline: `3px solid ${theme.color.mint400}`,
    outlineOffset: 0,
  },
  selectors: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
})

export const card = style({
  transition: 'border-color 150ms ease',
  '@media': {
    '(hover: hover)': {
      selectors: {
        [`${cardLink}:hover &`]: {
          borderColor: theme.color.blue400,
        },
      },
    },
  },
})

export const image = style({
  maxHeight: 180,
})
