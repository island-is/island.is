import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[2],
  maxWidth: '100%',
  flexWrap: 'wrap',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      flexDirection: 'row',
    },
  },
})

export const numberBox = style({
  padding: theme.spacing[3],
  backgroundColor: theme.color.blue100,
  borderRadius: theme.border.radius.large,
  color: theme.color.blue400,
  flexBasis: '100%',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      flexBasis: 'unset',
    },
  },
})

export const title = style({
  fontSize: '16px',
  color: theme.color.dark400,
  marginBottom: theme.spacing[1],
  fontWeight: theme.typography.semiBold,
})

export const value = style({
  color: theme.color.blue400,
  fontSize: '42px',
  fontWeight: theme.typography.semiBold,
  display: 'flex',
  gap: theme.spacing[1],
  alignItems: 'center',
})
