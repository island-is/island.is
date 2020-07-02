import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const layout = style({
  display: 'flex',
  '@media': {
    [`screen and (max-width: 991px)`]: {
      flexDirection: 'column',
    },
  },
})

export const reversed = style({
  flexDirection: 'row-reverse',
})

export const side = style({
  flex: '0 0 318px',
  '@media': {
    [`screen and (max-width: 991px)`]: {
      display: 'none',
    },
  },
})

export const bg = style({
  '@media': {
    [`screen and (max-width: 991px)`]: {
      backgroundColor: theme.color.purple100,
    },
  },
})

export const content = style({
  maxWidth: '773px',
  width: '100%',
  margin: '0 auto',
  display: 'block',
})
