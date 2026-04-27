import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

const MOBILE = `screen and (max-width: ${theme.breakpoints.md}px)`

export const tabWrapper = style({
  marginLeft: '33.333%',
  maxWidth: '1200px',
  width: 'calc(100% - 33.333%)',
  position: 'relative',
  '@media': {
    [MOBILE]: {
      marginLeft: 0,
      width: '100%',
    },
  },
})
