import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'relative',
  overflow: 'visible',
})

export const alphabetButton = style({
  display: 'inline-flex',
  margin: theme.spacing.smallGutter,
  fontSize: 18,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  color: theme.color.blue400,
  background: theme.color.white,
  width: 35,
  height: 35,
  transition: 'color .25s, background-color .25s',
  outline: 0,
  ':focus': {
    color: theme.color.white,
    backgroundColor: theme.color.blue400,
  },
  ':hover': {
    backgroundColor: theme.color.blue100,
  },
  selectors: {
    '&:focus:hover': {
      color: theme.color.white,
      backgroundColor: theme.color.blue400,
    },
  },
})

export const alphabetButtonSelected = style({
  color: theme.color.white,
  backgroundColor: theme.color.blue400,
})

export const alphabetList = style({
  display: 'table',
  width: '100%',
})

export const icon = style({
  position: 'relative',
  display: 'inline-block',
  top: 2,
})

export const tooltip = style({
  position: 'relative',
  display: 'inline-block',
  top: 3,
})

export const data = style({
  position: 'relative',
  display: 'flex',
  flexWrap: 'nowrap',
  width: '100%',
  alignItems: 'center',
})
