import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const iconButtonContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing[1],
  borderRadius: theme.border.radius.large,
  width: '34px',
  height: '34px',
  flexShrink: 0,
  transition: 'filter .2s, background-color .2s',

  selectors: {
    // The open state of a menu the button controls should look the same as hover
    '&:hover, &[aria-expanded="true"]': {
      filter: 'brightness(0.9)',
    },
  },
})

export const buttonDisabled = style({
  cursor: 'not-allowed',
  opacity: 0.5,

  selectors: {
    '&:hover, &[aria-expanded="true"]': {
      filter: 'brightness(1)',
    },
  },
})

export const transparent = style({
  selectors: {
    '&:hover, &[aria-expanded="true"]': {
      backgroundColor: theme.color.blue200,
      filter: 'brightness(1)',
    },
  },
})
