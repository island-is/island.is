import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const radioButtonSize = theme.spacing[3]
const radioButtonCheckSize = 12

export const root = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: 'calc(100% + 80px)',
  marginLeft: -40,
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
  fontWeight: theme.typography.light,
  lineHeight: theme.typography.baseLineHeight,
})

export const labelChecked = style({
  fontWeight: theme.typography.medium,
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
  transition: 'border-color .1s, shadow .1s, background-color .1s',
  width: radioButtonSize,
  selectors: {
    [`${root}:hover &:not(${radioButtonDisabled})`]: {
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

export const maskedNumbers = style({
  marginRight: 4,
})
