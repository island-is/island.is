import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const formIntro = style({
  marginBottom: theme.spacing[6],
})

export const contentWrapper = style({
  maxWidth: 660,
})

export const titleWrapper = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})
