import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 112,
  borderBottom: `1px solid ${theme.color.blue200}`,
  padding: `0 ${theme.spacing[6]}px`,
})

export const headerTextContainer = style({
  flexDirection: 'column',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
})

export const headerTextWrapper = style({
  marginTop: '5px',
})

export const headerDivider = style({
  display: 'none',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'inline-block',
      height: '19px',
      width: '2px',
      backgroundColor: theme.color.dark200,
      margin: `5px ${theme.spacing[3]}px 0 ${theme.spacing[3]}px`,
    },
  },
})
