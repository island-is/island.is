import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const infoContainer = style({
  overflow: 'hidden',
  maxHeight: 0,
  transition: 'max-height 250ms ease',
})

export const showInfoContainer = style({
  maxHeight: '350px',
})
