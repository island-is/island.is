import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  background: theme.color.blue100,
  borderBottomWidth: 1,
  borderStyle: theme.border.style.solid,
  borderColor: theme.color.blue200,
})

export const progressContainer = style({
  borderRadius: '0',
  height: '2px',
  flex: 0.975,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      borderRadius: '100px',
      background: theme.color.white,
      height: '5px',
    },
  },
})

export const progress = style({
  background: theme.color.blue400,
  borderRadius: '100px',
  height: '2px',
  transition: 'width .5s ease',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      height: '5px',
    },
  },
})

export const progressNumber = style({
  width: '4ch',
  textAlign: 'end',
})
