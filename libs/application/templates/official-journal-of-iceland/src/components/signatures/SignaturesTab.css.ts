import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const gridColumnSpacing = style({
  paddingInline: `${theme.spacing[1]}px !important`,
})

export const gridRowSpacing = style({
  marginInline: `-${theme.spacing[1]}px !important`,
  rowGap: theme.spacing[2],
})

export const alignBottom = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
})
