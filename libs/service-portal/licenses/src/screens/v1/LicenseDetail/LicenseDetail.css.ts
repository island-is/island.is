import { style, globalStyle } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const line = style({
  width: 1,
  height: theme.spacing[3],
  background: theme.color.dark200,
})

export const animatedContent = style({
  paddingTop: theme.spacing[1],
})

const listStyle = {
  fontWeight: theme.typography.light,
  listStyle: 'auto',
  paddingLeft: theme.spacing[3],
  paddingTop: theme.spacing[2],
  lineHeight: theme.typography.baseLineHeight,
}
const textStyle = {
  fontWeight: theme.typography.light,
  lineHeight: theme.typography.baseLineHeight,
}

export const gridWrapper = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
})

export const expandButtonWrapper = style({
  display: 'flex',
  alignItems: 'center',
})

export const centerColumn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'relative',

  ...themeUtils.responsiveStyle({
    xl: {
      selectors: {
        '&:first-child::after': {
          content: '',
          display: 'block',
          position: 'relative',
          height: '50%',
          marginLeft: theme.spacing[3],
          width: 1,
          background: theme.color.dark200,
        },
      },
    },
    lg: {
      selectors: {
        '&:first-child::after': {
          content: 'unset',
        },
      },
    },
  }),
})

export const gridRow = style({
  display: 'grid',

  ...themeUtils.responsiveStyle({
    xl: {
      gridTemplateColumns: 'auto 1fr 1fr 1fr',
    },
    lg: {
      gridTemplateColumns: '1fr',
    },
  }),
})

export const text = style({})

globalStyle(`${text} ol`, listStyle)
globalStyle(`${text} p`, textStyle)
