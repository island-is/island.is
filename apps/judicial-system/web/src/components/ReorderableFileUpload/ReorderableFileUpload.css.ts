import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const dropzone = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  border: `1px dashed ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  padding: `${theme.spacing[4]}px`,
  transition: 'border-color 0.2s ease-in-out',
  selectors: {
    '&:hover': {
      borderColor: theme.color.blue400,
    },
  },
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      padding: `${theme.spacing[6]}px`,
    },
  },
})

export const fileListContainer = style({
  alignSelf: 'stretch',
  width: '100%',
  marginTop: `${theme.spacing[3]}px`,
})

export const reorderGroup = style({
  position: 'relative',
  width: '100%',
})

export const reorderItem = style({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
})
