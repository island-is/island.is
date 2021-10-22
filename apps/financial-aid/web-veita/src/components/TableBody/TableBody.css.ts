import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tablePadding = style({
  paddingRight: theme.spacing[9],
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
})

export const link = style({
  transition: 'background-color ease 250ms',
  borderRadius: theme.spacing[1],
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.purple100,
    },
  },
})

export const firstChildPadding = style({
  paddingLeft: theme.spacing[2],
})
