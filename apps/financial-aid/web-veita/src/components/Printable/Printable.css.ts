import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const printableImages = style({
  marginBottom: theme.spacing[8],
})

export const printablePdf = style({
  width: '100%',
  height: '100%',
  display: 'block',
})
