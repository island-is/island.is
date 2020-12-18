import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { STICKY_NAV_HEIGHT } from '@island.is/web/constants'

const top = STICKY_NAV_HEIGHT + theme.spacing[1]

export const sidebarWrapper = style({
  top,
  minWidth: '318px',
  maxWidth: '318px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      maxWidth: '230px',
      minWidth: '230px',
    },
  },
})

export const sticky = style({
  position: 'sticky',
  alignSelf: 'flex-start',
})
