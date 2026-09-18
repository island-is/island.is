import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'
import { STICKY_NAV_HEIGHT } from '@island.is/web/constants'

export const searchInput = style({
  maxWidth: '475px',
})

export const noBorder = style({
  border: 'none',
})

export const line = style({
  borderLeft: `2px solid ${theme.color.blue400}`,
  width: 0,
  height: 'calc(100% + 1px)',
  left: 0,
  top: 0,
  zIndex: 10,
  position: 'absolute',
})

export const loader = style({
  minHeight: 24,
  minWidth: 24,
})

export const hiddenLine = style({
  visibility: 'hidden',
})

export const sidebarScroller = style({
  maxHeight: `calc(100dvh - ${STICKY_NAV_HEIGHT + theme.spacing[1]}px)`,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingBottom: theme.spacing[4],
})
