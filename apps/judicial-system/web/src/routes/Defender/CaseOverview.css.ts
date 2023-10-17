import { style } from '@vanilla-extract/css'

export const downloadAllButton = style({
  display: 'inline-block',

  selectors: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
})
