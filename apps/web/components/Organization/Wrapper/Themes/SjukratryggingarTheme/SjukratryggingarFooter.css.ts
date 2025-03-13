import { globalStyle, style } from '@vanilla-extract/css'

import { dark400, theme } from '@island.is/island-ui/theme'

export const footerBg = style({
  background: '#D8D9DA',
  color: '#000',
})

export const logoStyle = style({})

export const footerSecondRow = style({
  display: 'flex',
  minHeight: 72,
  alignItems: 'center',
})

export const footerItemFirst = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      maxWidth: 'none',
      flexBasis: '100%',
    },
  },
})

globalStyle(`${footerBg} a, ${footerBg} a:hover`, {
  color: `${dark400} !important`,
  boxShadow: 'none !important',
})

globalStyle(`${footerSecondRow} a, ${footerSecondRow} a:hover`, {
  boxShadow: `inset 0 -1px 0 0 ${dark400} !important`,
})

export const link = style({
  fontSize: '16px',
  textDecoration: 'underline',
  ':hover': {
    textDecoration: 'underline',
  },
})
