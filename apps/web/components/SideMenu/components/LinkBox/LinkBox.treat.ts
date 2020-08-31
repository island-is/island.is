import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  flex: `0 1 calc(50% - ${theme.spacing[1]}px)`,
  maxWidth: `calc(50% - ${theme.spacing[1]}px)`,
  margin: theme.spacing[1],
  position: 'relative',
  selectors: {
    ['&:nth-child(odd)']: {
      marginLeft: 0,
    },
    ['&:nth-child(even)']: {
      marginRight: 0,
    },
    ['a:hover &']: {
      textDecoration: 'none',
    },
  },
})

export const linkBox = style({
  alignItems: 'center',
  background: theme.color.blue100,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing[2],
  textAlign: 'center',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      selectors: {
        ['&:hover']: {
          borderColor: theme.color.blue300,
        },
      },
    },
  },
})

export const letterIcon = style({})

export const iconWrap = style({
  alignItems: 'center',
  background: theme.color.blue200,
  borderRadius: '50%',
  display: 'flex',
  flexDirection: 'column',
  height: 48,
  justifyContent: 'center',
  marginBottom: theme.spacing[2],
  width: 48,
})

export const hoverIcon = style({
  position: 'absolute',
  right: theme.spacing[1],
  top: theme.spacing[1],
  opacity: 0,
  transition: 'opacity 150ms ease-in',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      selectors: {
        [`${root}:hover &`]: {
          opacity: 1,
        },
      },
    },
  },
})
