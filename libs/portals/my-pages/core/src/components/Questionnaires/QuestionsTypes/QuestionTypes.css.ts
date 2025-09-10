import { globalStyles } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'
export const scaleContainer = style({})

export const scaleButton = style({
  borderRight: '1px solid',
  borderTop: '1px solid',
  borderBottom: '1px solid',
  borderColor: theme.color.blue200,
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue200,
      cursor: 'pointer',
      color: theme.color.white,
    },
  },
})

globalStyle(`${scaleContainer} ${scaleButton}:first-child`, {
  borderTopLeftRadius: theme.border.radius.standard,
  borderBottomLeftRadius: theme.border.radius.standard,
  borderLeft: '1px solid',
  borderTop: '1px solid',
  borderBottom: '1px solid',
  borderColor: theme.color.blue200,
})

globalStyle(`${scaleContainer} ${scaleButton}:last-child`, {
  borderTopRightRadius: theme.border.radius.standard,
  borderBottomRightRadius: theme.border.radius.standard,
})
