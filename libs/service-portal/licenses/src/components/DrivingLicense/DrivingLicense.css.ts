import { globalStyle, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const line = style({
  width: 1,
  height: theme.spacing[3],
  background: theme.color.dark200,
})

export const content = style({
  wordBreak: 'break-word',
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

export const text = style({})

globalStyle(`${text} ol`, listStyle)
globalStyle(`${text} p`, textStyle)

export const animatedContent = style({
  paddingTop: theme.spacing[1],
})

const linkBase = {
  color: theme.color.blue400,
  maxWidth: 'max-content',
  boxShadow: `inset 0px -1px ${theme.color.blue400}`,
  transition: 'box-shadow .25s, color .25s, background-color .25s',
  ':focus': {
    color: theme.color.dark400,
    backgroundColor: theme.color.mint400,
    boxShadow: `inset 0 -1px 0 0 ${theme.color.dark400}`,
  },
  ':hover': {
    color: theme.color.blueberry400,
    boxShadow: `inset 0 -1px 0 0 ${theme.color.blueberry400}`,
    textDecoration: 'none',
  },
}
export const QRCode = style({
  ...linkBase,
})

export const link = style({
  ...linkBase,
  textDecoration: 'none',
  fontSize: 12,
  lineHeight: 1.25,
  fontWeight: theme.typography.semiBold,
  paddingTop: theme.spacing.smallGutter,
  paddingBottom: theme.spacing.smallGutter,
  ...themeUtils.responsiveStyle({
    md: {
      lineHeight: theme.typography.baseLineHeight,
      fontSize: 14,
    },
  }),
})

export const icon = style({
  height: 16,
  ...themeUtils.responsiveStyle({
    md: {},
  }),
})

export const flexGrow = style({
  flex: 1,
  '@media': {
    [`screen and (min-width: 1200px)`]: {
      flex: 'none',
    },
  },
})

export const flexShrink = style({
  flex: 0,
  '@media': {
    [`screen and (min-width: 1200px)`]: {
      flex: 'none',
    },
  },
})

export const categoryContainer = style({
  width: 120,
})
