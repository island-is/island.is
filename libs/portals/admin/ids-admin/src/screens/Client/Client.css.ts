import { style } from '@vanilla-extract/css'
import { spacing } from '@island.is/island-ui/theme'

export const tagWrapper = style({
  height: spacing['4'],
  transition: 'all 0.3s',
})

export const tagHide = style({
  opacity: 0,
  height: 0,
})
