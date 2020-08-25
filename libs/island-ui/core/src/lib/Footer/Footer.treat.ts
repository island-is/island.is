import { style, globalStyle } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const links = style({})
export const linksWhite = style({})

export const columns = style({
  display: 'flex',
  width: '100%',
  flexWrap: 'wrap',
})

export const column = style({
  position: 'relative',
  marginBottom: 40,
  paddingRight: 0,
  width: '100%',
  ':last-child': {
    marginBottom: 0,
  },
  ...themeUtils.responsiveStyle({
    lg: {
      width: '33%',
      paddingRight: 48,
      marginBottom: 0,
    },
    xl: {
      width: '25%',
    },
  }),
})

export const columnBorder = style({
  ':after': {
    content: '""',
    display: 'none',
    position: 'absolute',
    right: 24,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: theme.color.blue200,
  },
  ...themeUtils.responsiveStyle({
    lg: {
      ':after': {
        display: 'inline-block',
      },
    },
  }),
})

export const columnLarge = style({
  width: '100%',
  ...themeUtils.responsiveStyle({
    lg: {
      width: '33%',
    },
    xl: {
      width: '50%',
    },
  }),
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
