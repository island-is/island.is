import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const navWrapper = style({
  paddingTop: theme.spacing[1],
})

export const link = style({
  overflow: 'hidden',
})

export const img = style({
  height: 'auto',
  width: 'auto',
  display: 'flex',
  maxHeight: 28,
  maxWidth: 28,
})

globalStyle(`${link} > span`, {
  boxShadow: 'none',
})

export const noScope = style({})

globalStyle(`${noScope} button:disabled`, {
  background: theme.color.white,
  boxShadow: `inset 0 0 0 1px ${theme.color.blue200}`,
})

globalStyle(`${noScope} button:disabled path`, {
  stroke: theme.color.dark300,
})

export const badge = style({
  position: 'absolute',
  top: 11,
  right: 16,
  height: theme.spacing[1],
  width: theme.spacing[1],
  borderRadius: '50%',
  backgroundColor: theme.color.red400,
  ...themeUtils.responsiveStyle({
    md: {
      top: 14,
    },
  }),
})

// Line

export const lineWrapper = style({
  width: '100%',
})

export const line = style({
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue100,
    },
  },
})

export const unread = style({
  backgroundColor: theme.color.blueberry100,
})
