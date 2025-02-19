import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

const gridContainerBase = {
  display: 'grid',
  gap: theme.spacing[3],
  justifyContent: 'stretch',
}

export const gridContainerOneColumn = style({
  ...gridContainerBase,
  gridTemplateColumns: '1fr',
})

export const gridContainerTwoColumn = style({
  ...gridContainerBase,
  gridTemplateColumns: '1fr 1fr',
})

export const gridContainerThreeColumn = style({
  ...gridContainerBase,
  gridTemplateColumns: '1fr 1fr 1fr',
})

export const iconBox = style({})

globalStyle(`${iconBox} > svg`, {
  minWidth: 24,
})
