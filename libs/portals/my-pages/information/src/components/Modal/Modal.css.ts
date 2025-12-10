import { spacing, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const closeButton = style({
  justifyContent: 'center',
  alignItems: 'center',

  position: 'absolute',
  top: spacing[4],
  right: spacing[4],
  zIndex: 20,

  cursor: 'pointer',

  ':hover': {
    color: theme.color.black,
  },
})

export const modalBase = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
})

export const modal = style({
  position: 'relative',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: 430,
  width: '100%',

  paddingTop: spacing[7],
  paddingBottom: spacing[5],
  paddingLeft: spacing[3],
  paddingRight: spacing[3],
  backgroundColor: theme.color.white,
  borderRadius: theme.border.radius.md,
  boxShadow: theme.shadows.small,
})
