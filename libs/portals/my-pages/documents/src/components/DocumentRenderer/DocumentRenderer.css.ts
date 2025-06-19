import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const pdfControls = style({
  padding: theme.spacing[1],
  background: theme.color.white,
  alignItems: 'center',

  borderTop: 1,
  borderLeft: 1,
  borderBottom: 1,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  borderRadius: `${theme.border.radius.standard} ${theme.border.radius.standard} 0 0`,
  justifyContent: 'center',
  ...themeUtils.responsiveStyle({
    md: {
      justifyContent: 'space-between',
    },
  }),
})

export const space = style({
  width: 24,
  display: 'none',
  ...themeUtils.responsiveStyle({
    md: {
      display: 'block',
    },
  }),
})

export const pdfAction = style({})

export const htmlDoc = style({})

export const pdfPage = style({
  background: theme.color.blue100,
  padding: theme.spacing[1],
  border: `1px solid ${theme.color.blue200}`,
  borderTop: 0,
})

globalStyle(`${pdfControls} button`, {
  boxShadow: 'none',
})

globalStyle(`${pdfAction} + button`, {
  display: 'none',
  ...themeUtils.responsiveStyle({
    md: {
      display: 'flex',
    },
  }),
})

globalStyle(`${htmlDoc} a`, {
  color: theme.color.blue400,
})

export const reveal = style({
  position: 'absolute',
  bottom: 20,
  right: 20,
  padding: 10,
  background: theme.color.dark400,
  color: theme.color.white,
  borderRadius: theme.border.radius.large,
  opacity: 0,
  borderWidth: 1,
  outline: 0,
  textDecoration: 'none',
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  overflow: 'hidden',
  zIndex: 1,
  '@media': {
    [`screen and (max-width: 991px)`]: {
      borderRadius: 0,
      border: 'none',
    },
  },
  transition: 'transform 150ms ease',
  transform: `translateY(calc(100% + 20px))`,
  ':focus-within': {
    transform: `translateY(0)`,
    opacity: 1,
  },
})
