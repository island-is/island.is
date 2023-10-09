import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const hideableTextContainer = style({
  display: 'grid',
  gridTemplateColumns: `1fr ${theme.spacing[6]}px`,
  alignItems: 'center',
  justifyItems: 'right',
})

export const eyeButton = style({
  position: 'relative',
})

export const eyeStrikethrough = style({
  display: 'block',
  position: 'absolute',
  top: '0',
  left: '1px',
  width: '30px',
  height: '2px',
  backgroundColor: theme.color.dark300,
  transform: 'rotate(45deg)',
  transformOrigin: 'left',
})
