import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import {
  inputErrorState,
  errorMessage as inputErrorMessage,
} from '../Input/Input.mixins'

const radioButtonSize = 24
const radioButtonCheckSize = 12
const radioButtonMargin = 16

export const container = style({
  position: 'relative',
})

export const large = style({
  borderRadius: theme.border.radius.large,
  border: `1px solid ${theme.color.blue200}`,
})

export const checkMarkWidth = 17
export const input = style({
  position: 'absolute',
  opacity: 0,
  left: 0,
  top: 0,
  height: radioButtonSize,
  width: radioButtonSize,
})
export const label = style({
  display: 'flex',
  fontSize: theme.typography.baseFontSize,
  fontWeight: theme.typography.light,
})
export const largeLabel = style({
  padding: `${theme.spacing[4]}px ${theme.spacing[3]}px`,
})
export const labelChecked = style({
  fontWeight: theme.typography.medium,
})
export const radioButtonDisabled = style({
  borderColor: theme.color.blue200,
  background: 'transparent',
})
export const radioButton = style({
  height: radioButtonSize,
  width: radioButtonSize,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing[2],
  backgroundColor: theme.color.white,
  transition: 'border-color .1s, shadow .1s, background-color .1s',
  selectors: {
    [`${container}:hover &:not(${radioButtonDisabled})`]: {
      borderColor: theme.color.blue400,
    },
    [`${input}:focus + ${label} &`]: {
      boxShadow: `0 0 0 4px ${theme.color.mint400}`,
    },
  },
})

export const radioButtonChecked = style({})

export const checkMark = style({
  width: radioButtonCheckSize,
  height: radioButtonCheckSize,
  borderRadius: '50%',
  backgroundColor: theme.color.transparent,
  transform: 'scale(1.4)',
  transition: 'transform .2s ease-out, background-color .2s',
  selectors: {
    [`${radioButtonChecked} &`]: {
      backgroundColor: theme.color.blue400,
      transform: 'scale(1)',
    },
  },
})

export const radioButtonLabelDisabled = style({
  color: theme.color.dark300,
})

export const radioButtonError = style(inputErrorState)
export const errorMessage = style(inputErrorMessage)

export const tooltipContainer = style({
  display: 'inline-block',
  marginLeft: theme.spacing[2],
})

export const tooltipLargeContainer = style({
  marginLeft: 'auto',
  paddingLeft: theme.spacing[2],
})
