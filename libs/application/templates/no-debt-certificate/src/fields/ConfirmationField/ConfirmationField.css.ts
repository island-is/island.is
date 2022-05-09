import { style } from '@vanilla-extract/css'

export const linkWithoutDecorations = style({
  ':hover': {
    textDecoration: 'none',
  },
})

export const linkStyle = style({
  color: '#0061ff',
  textDecoration: 'none',
  boxShadow: 'inset 0 -1px 0 0 currentColor',
  paddingBottom: 4,

  selectors: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
})
