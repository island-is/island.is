import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const toggleSwitchHeight = theme.spacing[3]
const toggleSwitchHeightLarge = theme.spacing[6]
const toggleSwitchWidth = 44 // theme.spacing[5.5] ?
const toggleSwitchWidthLarge = 88 // theme.spacing[11]

export const container = style({
  position: 'relative',
  '@media': {
    print: {
      display: 'none !important',
    },
  },
})

export const label = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: theme.typography.baseFontSize,
  fontWeight: theme.typography.light,
})
export const labelText = style({
  display: 'flex',
})
export const labelChecked = style({
  fontWeight: theme.typography.medium,
})
export const toggleSwitch = style({
  alignItems: 'center',
  alignSelf: 'center',
  backgroundColor: theme.color.white,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: '12px',
  display: 'flex',
  flexShrink: 0,
  height: toggleSwitchHeight,
  justifyContent: 'center',
  marginLeft: theme.spacing[2],
  position: 'relative',
  transition: 'border-color .1s, shadow .1s, background-color .1s',
  width: toggleSwitchWidth,
  selectors: {
    [`${container}:hover &`]: {
      borderColor: theme.color.blueberry400,
    },
  },
})

export const toggleSwitchLarge = style({
  borderRadius: '31px',
  height: toggleSwitchHeightLarge,
  width: toggleSwitchWidthLarge,
})

export const toggleSwitchChecked = style({
  selectors: {
    [`&${toggleSwitch}`]: {
      backgroundColor: theme.color.blue400,
      borderColor: theme.color.blue400,
    },
  },
})

export const toggleSwitchKnob = style({
  backgroundColor: theme.color.blue400,
  borderRadius: theme.border.radius.circle,
  height: theme.spacing[2],
  width: theme.spacing[2],
  position: 'absolute',
  top: 3,
  left: 3,
  transition: 'transform .1s',
})
export const toggleSwitchKnobLarge = style({
  height: theme.spacing[4],
  width: theme.spacing[4],
  top: theme.spacing[1] - 1,
  left: theme.spacing[1] - 1,
})
export const toggleSwitchKnobDisabled = style({
  backgroundColor: theme.color.blue200,
})
export const toggleSwitchKnobChecked = style({
  transform: `translateX(20px)`,
  backgroundColor: theme.color.white,
  selectors: {
    [`&${toggleSwitchKnobLarge}`]: {
      transform: `translateX(38px)`,
    },
  },
})
