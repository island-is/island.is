import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const processContainer = style({
  minHeight: 'calc(100vh - 112px)',
  display: 'flex',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      paddingTop: `0px`,
      paddingBottom: `0px`,
    },
  },
})

export const gridContainer = style({
  height: 'inherit',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      paddingLeft: `0px`,
      paddingRight: `0px`,
    },
  },
})
