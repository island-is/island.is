import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const hidden = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    md: {
      visibility: 'hidden',
    },
  }),
})

export const row = style({
  padding: '20px 0',
})

export const item = style({
  display: 'flex',
  alignItems: 'flex-start',
})

export const rowGap = style({
  rowGap: theme.spacing[1] / 2,
})

// We are using grid in the dateContainer parent with rowGap 24px.
// This is used in mobile to align the date with the rest of the content.
export const dateContainer = style({
  marginTop: -theme.spacing[1],
  ...themeUtils.responsiveStyle({
    md: {
      marginTop: 0,
    },
  }),
})
