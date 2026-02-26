import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import {
  inputErrorState,
  errorMessage as inputErrorMessage,
} from '../Input/Input.mixins'

export const checkMarkWidth = theme.spacing[2]
const checkboxSize = theme.spacing[3]

export const container = style({
  position: 'relative',
})

export const filled = style({
  background: theme.color.white,
})

export const large = style({
  borderRadius: theme.border.radius.large,
  border: `1px solid ${theme.color.blue200}`,
})

export const input = style({
  height: checkboxSize,
  left: 0,
  opacity: 0,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: checkboxSize,
  cursor: 'pointer',
})
export const inputLarge = style({
  transform: 'translateY(-50%) translateX(100%)',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      transform: 'translateY(-50%) translateX(65%)',
    },
  },
})
export const label = style({
  display: 'flex',
  fontSize: theme.typography.baseFontSize,
  alignItems: 'center',
})
export const labelText = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
})
export const checkboxDisabled = style({
  background: 'transparent',
  borderColor: theme.color.blue200,
})
export const largeLabel = style({
  alignItems: 'center',
  padding: `${theme.spacing[3]}px ${theme.spacing[2]}px`,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      padding: `${theme.spacing[3]}px ${theme.spacing[3]}px`,
    },
  },
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

export const checkboxLabelDisabled = style({
  color: theme.color.dark300,
})

export const checkboxError = style(inputErrorState)
export const errorMessage = style(inputErrorMessage)

export const isRequiredStar = style({
  color: theme.color.red600,
})

export const tooltipContainer = style({
  display: 'inline-block',
  marginLeft: theme.spacing[2],
})

export const tooltipLargeContainer = style({
  marginLeft: 'auto',
  paddingLeft: theme.spacing[2],
})

export const fixJumpingContentFromFontWeightToggle = style({
  visibility: 'hidden',
  height: 0,
})

export const labelChildrenFontWeightToggle = style({})

globalStyle(`${labelChildrenFontWeightToggle} p`, {
  fontWeight: `${theme.typography.semiBold} !important`,
})
