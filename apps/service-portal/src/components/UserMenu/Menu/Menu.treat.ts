import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const menu = style({
  position: 'absolute',
  right: 0,
  width: 366,
  padding: 0,
  margin: 0,
  opacity: 0,
  backgroundColor: theme.color.white,
  overflowY: 'auto',
  border: `1px solid ${theme.color.dark100}`,
  boxShadow: theme.shadows.subtle,
  visibility: 'hidden',
  transition: 'opacity 200ms',
})

export const open = style({
  zIndex: 1,
  opacity: 1,
  visibility: 'visible',
})

export const avatar = style({
  width: 70,
  height: 70,
  marginRight: 20,
  backgroundColor: theme.color.red400,
  borderRadius: '100%',
})

export const subjectButton = style({
  transition: 'color 200ms',
  ':hover': {
    color: theme.color.blue400,
  },
})
