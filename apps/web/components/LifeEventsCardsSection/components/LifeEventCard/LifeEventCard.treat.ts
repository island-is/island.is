import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const thumbnail = style({
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: 137,
  height: 156,
  flex: 'none',
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'block',
    },
  },
})

export const card = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      border: `1px solid ${theme.color.purple200}`,
      borderRadius: 8,
      ':hover': {
        borderColor: theme.color.purple400,
      },
    },
  },
})

export const image = style({
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: '100%',
  flex: 'none',
  paddingBottom: '100%',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
})
