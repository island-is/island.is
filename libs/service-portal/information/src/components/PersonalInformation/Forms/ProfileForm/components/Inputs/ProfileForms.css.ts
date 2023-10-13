import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const bank = style({
  marginRight: theme.spacing['1'],
  maxWidth: '120px',
  marginBottom: theme.spacing['2'],
  ...themeUtils.responsiveStyle({
    sm: {
      maxWidth: '115px',
      marginBottom: 0,
    },
  }),
})

export const hb = style({
  marginRight: theme.spacing['1'],
  maxWidth: '100px',
  marginBottom: theme.spacing['2'],
  ...themeUtils.responsiveStyle({
    sm: {
      maxWidth: '92px',
      marginBottom: 0,
    },
  }),
})

export const account = style({
  marginRight: theme.spacing['1'],
  maxWidth: '200px',
  ...themeUtils.responsiveStyle({
    sm: {
      maxWidth: '100%',
    },
  }),
})

export const formContainer = style({
  maxWidth: 400,
  width: '100%',
})

export const codeInput = style({
  maxWidth: 210,
})

export const codeButton = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      alignSelf: 'flex-end',
      marginTop: theme.spacing['2'],
      paddingTop: 0,
    },
  },
})

export const nudgeSave = style({
  marginTop: theme.spacing['2'],
  ...themeUtils.responsiveStyle({
    sm: {
      marginTop: 0,
      marginLeft: theme.spacing['2'],
    },
  }),
})

export const countryCodeInput = style({
  marginRight: theme.spacing['2'],
  maxWidth: '90px',
  ...themeUtils.responsiveStyle({
    sm: {
      maxWidth: '120px',
    },
  }),
})

globalStyle(`${hb} input, ${bank} input`, {
  paddingRight: 0,
})
