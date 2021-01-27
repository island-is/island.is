import { globalStyle, style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const footer = style({
  background: theme.color.blueberry600,
  color: theme.color.white,
  paddingTop: 36,
})

export const footerTitleWrapper = style({
  paddingBottom: 40,
  borderBottom: '1px solid',
  borderColor: theme.color.blueberry300,
  marginBottom: 40,
})

export const footerTitle = style({
  fontSize: 34,
  lineHeight: 44 / 34,
  fontWeight: 600,
})

export const footerLogo = style({
  width: 70,
  marginRight: 30,
})

export const footerItem = style({
  fontSize: 14,
  lineHeight: 20 / 14,
  marginBottom: 45,
})

globalStyle(`${footerItem}:nth-child(1)`, {
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      maxWidth: 'none',
      flexBasis: '100%',
    },
  },
})

export const footerItemTitle = style({
  fontSize: 18,
  fontWeight: 400,
  lineHeight: 28 / 18,
  marginBottom: 10,
})

globalStyle(`${footerItemTitle} a`, {
  textDecoration: 'underline',
})

globalStyle(`${footerItem}:nth-child(1) ${footerItemTitle}`, {
  fontWeight: 600,
  textDecoration: 'none',
})

globalStyle(`${footerItem} p`, {
  color: 'inherit',
})
