import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tabWrapper = style({
  padding: '2px',
  position: 'relative',
  flexGrow: 1,
  fontWeight: 'lighter',
  fontSize: 16,
  borderRadius: theme.border.radius.standard,
  color: theme.color.black,
})
export const tab = style({
  margin: '2px',
  padding: `${theme.spacing[1]}px ${theme.spacing[2]}px`,
  selectors: {
    '&:hover': {
      background: theme.color.white,
      color: theme.color.blue400,
      transition: 'all 200ms linear',
    },
  },
})

export const active = style({
  backgroundColor: theme.color.white,
  borderWidth: theme.border.width.standard,
  borderColor: theme.border.color.blue200,
  color: theme.color.blue400,
})

export const text = style({
  color: 'inherit',
})

export const activeText = style({
  fontWeight: theme.typography.semiBold,
})
