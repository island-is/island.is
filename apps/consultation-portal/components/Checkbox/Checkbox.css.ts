import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import {
  inputErrorState,
  errorMessage as inputErrorMessage,
} from '../../../../libs/island-ui/core/src/lib/Input/Input.mixins'

const checkboxSize = theme.spacing[3]

export const container = style({
  position: 'relative',
})

export const input = style({
  height: checkboxSize,
  left: 0,
  opacity: 0,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: checkboxSize,
})

export const label = style({
  display: 'flex',
  fontSize: theme.typography.baseFontSize,
  alignItems: 'center',
})

export const checkboxLabelDisabled = style({
  color: theme.color.dark300,
})

export const checkboxDisabled = style({
  background: 'transparent',
  borderColor: theme.color.blue200,
})

export const checkbox = style({
  alignItems: 'center',
  alignSelf: 'center',
  backgroundColor: theme.color.white,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.standard,
  display: 'flex',
  flexShrink: 0,
  height: checkboxSize,
  justifyContent: 'center',
  marginRight: theme.spacing[2],
  transition: 'border-color .1s, shadow .1s, background-color .1s',
  width: checkboxSize,
  selectors: {
    [`${container}:hover &:not(${checkboxDisabled})`]: {
      borderColor: theme.color.blue400,
    },
    [`${input}:focus + ${label} &`]: {
      boxShadow: `0 0 0 4px ${theme.color.mint400}`,
    },
  },
})

export const checkboxChecked = style({
  selectors: {
    [`&${checkbox}`]: {
      backgroundColor: theme.color.blue400,
      borderColor: theme.color.blue400,
    },
  },
})

export const checkboxError = style(inputErrorState)
export const errorMessage = style(inputErrorMessage)
