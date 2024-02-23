import { blue100, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const addChannel = recipe({
  base: {
    display: 'none',
    borderLeftWidth: 2,
    padding: theme.spacing[4],
    borderLeftColor: theme.color.blue400,
    background: blue100,
    marginBottom: theme.spacing[3],
  },
  variants: {
    visible: {
      true: {
        display: 'block',
      },
    },
  },
})

export const contentWrap = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing[3],
})

export const emailWrap = style({
  minWidth: 260,
  flex: 2,
})

export const phoneWrap = style({
  flex: 1,
  width: '100%',
  minWidth: 260,
})

export const errorText = style({
  fontSize: 14,
  color: theme.color.red600,
})
