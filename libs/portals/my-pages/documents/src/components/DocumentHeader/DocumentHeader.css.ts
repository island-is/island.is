import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const categoryDivider = style({
  position: 'relative',
  display: 'flex',
  selectors: {
    '&::before': {
      content: "''",
      position: 'relative',
      top: '0.125rem',
      height: '1rem',
      width: 1,
      margin: '0 1rem',
      background: theme.color.blue200,
    },
  },
})

export const actionBarWrapper = style({
  display: 'flex',
  alignSelf: 'center',
  gap: '1rem',
  alignItems: 'center',
  marginLeft: 'auto',
})

export const titleText = style({})

globalStyle(`${titleText} p`, {
  opacity: 0.8,
})
