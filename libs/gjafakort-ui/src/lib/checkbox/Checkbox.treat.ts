import { style } from 'treat'
import { theme } from '../styles'

const checkboxSize = 24
const checkboxMargin = 16

export const container = style({
  position: 'relative',
  paddingLeft: checkboxSize + checkboxMargin,
})
export const checkMarkColor = theme.white
export const checkMarkWidth = 17
export const input = style({
  position: 'absolute',
  opacity: 0,
})
export const label = style({
  fontSize: theme.baseFontSize,
})
export const labelChecked = style({
  fontWeight: theme.fontWeightSemiBold,
})
export const checkbox = style({
  height: checkboxSize,
  width: checkboxSize,
  border: `1px solid ${theme.blue200}`,
  position: 'absolute',
  left: 0,
  top: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.white,
  transition: 'border-color .1s, shadow .1s, background-color .1s',
  selectors: {
    [`${container}:hover &`]: {
      borderColor: theme.blue400,
    },
    [`${input}:focus + ${label} &`]: {
      boxShadow: `0 0 0 4px ${theme.mint400}`,
    },
  },
})

export const checkboxChecked = style({
  selectors: {
    [`&${checkbox}`]: {
      backgroundColor: theme.blue400,
      borderColor: theme.blue400,
    },
  },
})
