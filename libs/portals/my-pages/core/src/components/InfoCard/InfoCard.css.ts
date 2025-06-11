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
  maxHeight: 180,
})

export const smallImage = style({
  minHeight: 85,
  maxHeight: 105,
  width: 'auto',
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
export const detailItem = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})

export const detailContainer = style({
  width: 'fit-content',
  ...themeUtils.responsiveStyle({
    xl: {
      width: '100%',
    },
  }),
})
