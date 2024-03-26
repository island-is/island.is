import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const uppercase = style({
  textTransform: 'uppercase',
})

export const ownPopertyShareContainer = style({
  borderRadius: theme.border.radius.large,
  padding: 24,
  // backgroundColor: theme.color.blue100,
  border: `1px solid ${theme.color.blue200}`,
})

export const ownPropertyShareCheckboxContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
})

export const removeFieldButton = style({
  top: 0,
  right: 0,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      top: theme.spacing['9'],
      right: -theme.spacing['6'],
    },
  },
})

export const removeFieldButtonSingle = style({
  top: 0,
  right: 0,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      top: theme.spacing['3'],
      right: -theme.spacing['6'],
    },
  },
})

export const printButton = style({
  '@media': {
    [`screen and (min-width: 932px)`]: {
      top: 106,
      left: 140,
      zIndex: 10,
    },
  },
})
