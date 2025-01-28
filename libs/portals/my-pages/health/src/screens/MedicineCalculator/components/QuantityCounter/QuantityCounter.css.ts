import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const quantityCounterWrapper = style({
  display: 'flex',
  columnGap: '0.5rem',
  alignItems: 'center',
})

export const quantityCounterButton = style({
  borderRadius: '50%',
  padding: 4,
  background: theme.color.blue100,

  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
})
