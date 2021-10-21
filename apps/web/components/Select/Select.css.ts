import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'relative',
  height: '45px',
  lineHeight: '45px',
  fontWeight: 600,
})

export const select = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
})

export const label = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
})

export const icon = style({
  position: 'absolute',
  top: 0,
  right: 0,
})
