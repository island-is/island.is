import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import {
  inputErrorState,
  errorMessage as inputErrorMessage,
} from '../Input/Input.mixins'

const radioButtonSize = theme.spacing[3]
const radioButtonCheckSize = 12
export const checkMarkWidth = theme.spacing[2]

export const container = style({
  position: 'relative',
})

export const large = style({
  borderRadius: theme.border.radius.large,
  border: `1px solid ${theme.color.blue200}`,
})

export const largeError = style({
  border: `1px solid ${theme.color.red600}`,
})

export const input = style({
  height: radioButtonSize,
  left: 0,
  opacity: 0,
  position: 'absolute',
  top: 0,
  width: radioButtonSize,
})
export const label = style({
  display: 'flex',
  fontSize: theme.typography.baseFontSize,
  lineHeight: theme.typography.baseLineHeight,
})
export const labelText = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  justifyContent: 'space-between',
})
export const largeLabel = style({
  alignItems: 'center',
  padding: `${theme.spacing[3]}px ${theme.spacing[2]}px`,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      padding: `${theme.spacing[3]}px`,
    },
  },
})
export const radioButtonDisabled = style({
  background: 'transparent',
  borderColor: theme.color.blue200,
})
export const radioButton = style({
  alignItems: 'center',
  backgroundColor: theme.color.white,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: '50%',
  display: 'flex',
  flexShrink: 0,
  height: radioButtonSize,
  justifyContent: 'center',
  marginRight: theme.spacing[2],
  transition: 'border-color .1s, shadow .1s, background-color .1s',
  width: radioButtonSize,
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
  backgroundColor: theme.color.transparent,
  borderRadius: '50%',
  height: radioButtonCheckSize,
  transform: 'scale(1.4)',
  transition: 'transform .2s ease-out, background-color .2s',
  width: radioButtonCheckSize,
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

export const radioButtonError = style({
  ...inputErrorState,
  paddingBottom: 0,
})

export const errorMessage = style({
  ...inputErrorMessage,
  padding: `0 ${theme.spacing[3]}px ${theme.spacing[2]}px ${theme.spacing[3]}px`,
})

export const tooltipContainer = style({
  display: 'inline-block',
  marginLeft: theme.spacing[2],
})

export const tooltipLargeContainer = style({
  marginLeft: 'auto',
  paddingLeft: theme.spacing[2],
})

export const toolTipLargeContainerWithIllustration = style({
  marginLeft: 0,
  paddingLeft: theme.spacing[2],
})

export const licenseContainer = style({
  width: 'auto',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      width: 'fit-content',
    },
  },
})

export const licenseLabel = style({
  flexDirection: 'row-reverse',
  alignSelf: 'flex-start',
  justifyContent: 'space-between',
  height: '135px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'column',
      alignItems: 'center',
      height: 'auto',
    },
  },
})

export const imageContainer = style({
  marginLeft: 0,
})

export const signatureImageContainer = style({
  width: 'calc(100% + 32px)',
  position: 'relative',
  right: theme.spacing[4],
})

export const signatureImage = style({
  width: '100%',
})

export const image = style({
  borderRadius: theme.border.radius.standard,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      height: '100%',
      width: '180px',
    },
  },
})

export const licenseText = style({
  alignSelf: 'self-start',
  paddingRight: theme.spacing[2],
  order: 1,
  width: '100px',
  
  '@media': {
    [`screen and (min-width: 400px)`]: {
      width: 'auto',
    },
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      order: 0,
      bottom: theme.spacing[1],
      position: 'relative',
      paddingLeft: theme.spacing[5],
      maxWidth: '140px',
    },
  },
})

export const licenseCheckmark = style({
  position: 'relative',
  alignSelf: 'self-start',
  order: 2,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      order: 0,
      top: theme.spacing[2],
    },
  },
})
