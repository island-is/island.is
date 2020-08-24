import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const menu = style({
  opacity: 0,
  backgroundColor: theme.color.blue100,
  overflowY: 'auto',
  visibility: 'hidden',
  transition: 'opacity 200ms',
})

export const open = style({
  zIndex: 1,
  opacity: 1,
  visibility: 'visible',
})

export const subjectButton = style({
  transition: 'color 200ms',
  ':hover': {
    color: theme.color.blue400,
  },
})

export const link = style({
  transition: 'color 200ms',
  ':hover': {
    textDecoration: 'none',
    color: theme.color.blue400,
  },
})
