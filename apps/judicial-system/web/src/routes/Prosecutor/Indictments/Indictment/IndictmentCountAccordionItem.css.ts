import { style } from '@vanilla-extract/css'

export const reorderItem = style({
  position: 'relative',
  overflow: 'hidden',
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
