import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 112,
  borderBottom: `1px solid ${theme.color.blue200}`,
  padding: `0 ${theme.spacing[3]}px`,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      padding: `0 ${theme.spacing[6]}px`,
    },
  },
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

export const link = style({
  color: theme.color.blue400,

  selectors: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
})

export const dropdownItem = style({
  display: 'flex',
  borderTop: `2px solid ${theme.color.dark200}`,
  paddingTop: `${theme.spacing[3]}px`,
})
