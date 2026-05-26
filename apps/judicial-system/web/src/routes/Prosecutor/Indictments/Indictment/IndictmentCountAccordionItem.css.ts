import { style } from '@vanilla-extract/css'

export const reorderItem = style({
  position: 'relative',
})

export const warningIcon = style({
  position: 'relative',
  zIndex: 1,
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  selectors: {
    '&:hover': {
      zIndex: 50,
    },
  },
})

export const itemWrapper = style({
  display: 'flex',
  alignItems: 'stretch',
})

export const dragHandle = style({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '12px',
  paddingRight: '8px',
  cursor: 'grab',
  selectors: {
    '&:active': {
      cursor: 'grabbing',
    },
  },
})

export const accordionWrapper = style({
  flex: 1,
  minWidth: 0,
})
