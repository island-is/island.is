import { style, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const withDecorator = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      borderBottom: 'none',
      borderRight: `1px solid ${theme.color.blue200}`,
    },
  },
})

export const links = style({})
export const linksWhite = style({})

export const withIcon = style({
  display: 'flex',
  alignItems: 'center',
})

globalStyle(`${links} a`, {
  color: theme.color.blue400,
  transition: 'color .2s, box-shadow .2s',
  textDecoration: 'none',
  boxShadow: `inset 0 -1px 0 0 ${theme.color.blue400} 0`,
})

globalStyle(`${links} a:hover`, {
  color: theme.color.blueberry400,
  boxShadow: `inset 0 -2px 0 0 ${theme.color.blueberry400}`,
  textDecoration: 'none',
})

globalStyle(`${links} a svg path`, {
  transition: 'fill .2s, box-shadow .2s',
  fill: theme.color.blue400,
})

globalStyle(`${links} a:hover svg path`, {
  fill: theme.color.blueberry400,
})

globalStyle(`${linksWhite} a`, {
  color: theme.color.white,
  transition: 'color .2s, box-shadow .2s',
  textDecoration: 'none',
  boxShadow: `inset 0 -1px 0 0 ${theme.color.white} 0`,
})

globalStyle(`${linksWhite} a:hover`, {
  color: theme.color.white,
  boxShadow: `inset 0 -2px 0 0 ${theme.color.white}`,
  textDecoration: 'none',
})

globalStyle(`${linksWhite} a svg path`, {
  transition: 'fill .2s, box-shadow .2s',
  fill: theme.color.white,
})

globalStyle(`${linksWhite} a:hover svg path`, {
  fill: theme.color.white,
})
