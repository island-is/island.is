import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  background: theme.color.blue100,
  borderBottomWidth: 1,
  borderStyle: theme.border.style.solid,
  borderColor: theme.color.blue200,
})

export const progressContainer = style({
  background: theme.color.white,
  borderRadius: '100px',
  height: '5px',
  flex: 0.975,
})

export const progress = style({
  background: theme.color.blue400,
  borderRadius: '100px',
  height: '5px',
  transition: 'width .5s ease',
})

export const progressNumber = style({
  width: '4ch',
  textAlign: 'end',
})
