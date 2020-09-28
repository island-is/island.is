import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import {
  inputErrorState,
  errorMessage as inputErrorMessage,
} from '../Input/Input.mixins'

const checkboxSize = 24

export const container = style({
  position: 'relative',
})
export const large = style({
  borderRadius: theme.border.radius.large,
  border: `1px solid ${theme.color.blue200}`,
})
export const checkMarkColorUnchecked = 'transparent'
export const checkMarkColor = 'white'
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
  display: 'flex',
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
export const largeLabel = style({
  padding: `${theme.spacing[4]}px ${theme.spacing[3]}px`,
})
export const checkbox = style({
  height: checkboxSize,
  width: checkboxSize,
  border: `1px solid ${theme.color.blue200}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing[2],
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

export const tooltipContainer = style({
  display: 'inline-block',
  marginLeft: theme.spacing[2],
})

export const tooltipLargeContainer = style({
  marginLeft: 'auto',
  paddingLeft: theme.spacing[2],
})
