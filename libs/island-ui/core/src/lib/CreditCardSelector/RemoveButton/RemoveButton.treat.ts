import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const root = style({
  borderRadius: '50%',
  width: 24,
  height: 24,
  border: `1px solid ${theme.color.blue400}`,
  position: 'relative',
  outline: 0,
  selectors: {
    [`&:hover`]: {
      borderColor: theme.color.blue400,
    },
    [`&:focus`]: {
      boxShadow: `0 0 0 4px ${theme.color.mint400}`,
    },
  },
})

export const icon = style({
  width: 10,
  height: 2,
  background: theme.color.blue400,
  position: 'absolute',
  left: 0,
  right: 0,
  margin: 'auto',
  top: 0,
  bottom: 0,
  borderRadius: 5,
})
