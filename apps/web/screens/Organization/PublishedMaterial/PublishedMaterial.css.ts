import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  minHeight: '800px',
})

export const orderByContainer = style({
  display: 'flex',
  flexDirection: 'row',
  cursor: 'pointer',
  overflow: 'hidden',
})

export const orderByText = style({
  textDecoration: 'underline',
  fontSize: '14px',
})

export const orderByIcon = style({
  marginRight: '-4px',
})

export const orderByItem = style({
  overflow: 'hidden',
  ':hover': {
    backgroundColor: theme.color.dark100,
  },
})
