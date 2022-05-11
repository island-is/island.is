import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const row = style({
  display: 'flex',
  alignItems: 'center',
})

export const column = style({
  paddingBottom: 0,
})

export const hidden = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    md: {
      visibility: 'hidden',
    },
  }),
})

export const item = style({
  display: 'flex',
  alignItems: 'center',
})

export const pTitle = style({
  fontSize: 14,
  fontWeight: 600,
})

export const pItem = style({
  fontSize: 14,
})

export const bottomBorder = style({
  ...themeUtils.responsiveStyle({
    md: {
      borderBottom: theme.border.width.standard,
    },
  }),
})
