import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const gridCard = style({
  display: 'flex',
  flexDirection: 'column',
})

export const container = style({
  flex: '1 0 auto',
})

export const containerLink = style({
  display: 'block',
  height: '100%',
})

export const boxContainer = style({
  ':focus': {
    borderColor: theme.color.mint400,
  },
  ':hover': {
    borderColor: theme.color.blue400,
  },
})

export const gridRow = style({
  justifyContent: 'space-between',
})
export const icon = style({
  padding: 0,
})

export const detailDivider = styleVariants({
  large: {
    height: 72,
    width: 1,
    backgroundColor: theme.color.blue200,
    alignSelf: 'center',
  },
  small: {
    height: 72,
    width: 1,
    backgroundColor: theme.color.blue200,
    alignSelf: 'center',
    ...themeUtils.responsiveStyle({
      md: {
        height: 1,
        width: '100%',
      },
    }),
  },
})

export const contentContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
})

export const imageContainer = style({
  paddingTop: theme.spacing[1],
  display: 'flex',
  alignItems: 'flex-end',
  height: '100%',
})

export const image = style({
  maxHeight: 120,
})

export const smallImage = style({
  minHeight: 85,
  maxHeight: 105,
  width: 'auto',
})

export const flexItem = style({
  flex: 3,
})

export const flexItemBorder = style({
  width: '100%',
  flex: 1,
})

globalStyle(`${flexItemBorder} > div`, {
  ...themeUtils.responsiveStyle({
    xs: {
      width: '100%',
    },
    xl: {
      width: 'auto',
    },
  }),
})
