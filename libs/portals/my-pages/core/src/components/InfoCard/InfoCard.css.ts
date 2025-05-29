import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const container = style({})
export const boxContainer = style({
  ':focus': {
    borderColor: theme.color.mint400,
  },
  ':hover': {
    borderColor: theme.color.blue400,
  },
})

export const image = style({
  minHeight: 150,
  minWidth: 150,
  maxHeight: 200,
})

export const icon = style({
  padding: 0,
})

export const detailDivider = styleVariants({
  large: {
    height: 72,
    width: 1,
    backgroundColor: theme.color.blue200,
    // ...themeUtils.responsiveStyle({
    //   xs: {
    //     height: 1,
    //     width: '100%',
    //   },
    // }),
    selectors: {
      '&:last-of-type': {
        height: 'unset',
        width: 'unset',
      },
    },
  },
  small: {
    height: 72,
    width: 1,
    backgroundColor: theme.color.blue200,
    ...themeUtils.responsiveStyle({
      md: {
        height: 1,
        width: '100%',
      },
    }),
  },
})

export const detailItem = style({
  flexGrow: 1,
  //   ...themeUtils.responsiveStyle({
  //     xs: {
  //       borderBottomWidth: theme.border.width.standard,
  //     },
  //     xl: {
  //       borderRightWidth: theme.border.width.standard,
  //       borderBottom: 'unset',
  //     },
  //   }),
  //   selectors: {
  //     '&:last-of-type': {
  //       borderRight: 'unset',
  //       borderBottom: 'unset',
  //     },
  //   },
})

globalStyle(`${detailDivider}:last-of-type`, {
  height: 0,
  width: 0,
})
