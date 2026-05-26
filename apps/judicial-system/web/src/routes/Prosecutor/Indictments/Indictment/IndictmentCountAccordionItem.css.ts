import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const reorderItem = style({
  position: 'relative',
  selectors: {
    '&:not(:last-child)': {
      marginBottom: theme.spacing[2],
    },
  },
})

export const label = style({
  width: '100%',
})

export const labelStart = style({
  display: 'flex',
  alignItems: 'center',
  columnGap: theme.spacing[1],
  minWidth: 0,
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

export const labelDate = style({
  flexShrink: 0,
  marginLeft: theme.spacing[2],
})

export const itemWrapper = style({
  display: 'flex',
  alignItems: 'stretch',
})

export const dragHandle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: 48,
  position: 'relative',
  zIndex: 2,
  cursor: 'grab',
  touchAction: 'none',
  selectors: {
    '&:active': {
      cursor: 'grabbing',
    },
  },
})

export const accordionWrapper = style({
  flex: 1,
  minWidth: 0,
  isolation: 'isolate',
})
