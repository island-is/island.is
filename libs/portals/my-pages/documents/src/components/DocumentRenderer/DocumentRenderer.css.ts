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
