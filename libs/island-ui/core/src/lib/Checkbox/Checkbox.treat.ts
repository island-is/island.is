import { style } from 'treat'
import { theme } from '../../theme'
import {
  inputErrorState,
  errorMessage as inputErrorMessage,
} from '../Input/Input.mixins'

const checkboxSize = 24
const checkboxMargin = 16

export const container = style({
  position: 'relative',
  paddingLeft: checkboxSize + checkboxMargin,
})
export const checkMarkColorUnchecked = 'transparent'
export const checkMarkColor = theme.color.white
export const checkMarkWidth = 17
export const input = style({
  position: 'absolute',
  opacity: 0,
  left: 0,
  top: 0,
  height: checkboxSize,
  width: checkboxSize,
})
export const label = style({
  fontSize: theme.typography.baseFontSize,
  fontWeight: theme.typography.light,
})
export const labelChecked = style({
  fontWeight: theme.typography.medium,
})
export const checkboxDisabled = style({
  borderColor: theme.color.blue200,
  background: 'transparent',
})
export const checkbox = style({
  height: checkboxSize,
  width: checkboxSize,
  border: `1px solid ${theme.color.blue200}`,
  position: 'absolute',
  left: 0,
  top: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.color.white,
  transition: 'border-color .1s, shadow .1s, background-color .1s',
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

export const checkboxLabelDisabled = style({
  color: theme.color.dark300,
})

export const checkboxError = style(inputErrorState)
export const errorMessage = style(inputErrorMessage)
