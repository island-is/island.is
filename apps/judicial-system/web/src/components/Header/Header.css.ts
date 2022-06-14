import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  maxWidth: '1440px',
  padding: `0 ${theme.spacing[6]}px`,
  margin: '0 auto',
})

export const logoContainer = style({
  flexDirection: 'column',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
})

export const logoContainerRvgName = style({
  display: 'none',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'flex',
      marginTop: '5px',
    },
  },

  selectors: {
    '&::before': {
      content: '',
      display: 'inline-block',
      height: '19px',
      width: '2px',
      backgroundColor: theme.color.dark200,
      margin: `5px ${theme.spacing[3]}px 0 ${theme.spacing[3]}px`,
    },
  },
})

export const dropdownItem = style({
  display: 'flex',
  borderTop: `2px solid ${theme.color.dark200}`,
  paddingTop: `${theme.spacing[3]}px`,
})
