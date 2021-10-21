import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
const { spacing, color, typography } = theme

export const toggleSwitchLarge = style({})
export const toggleSwitchChecked = style({})
export const toggleSwitchDisabled = style({})
export const toggleSwitchHiddenLabel = style({})

export const toggleSwitch = style({
  position: 'relative',
  display: 'flex',
  width: 'fit-content',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: spacing[2],

  // link styles
  color: 'inherit',
  fontSize: typography.baseFontSize,
  fontWeight: typography.light,
  cursor: 'pointer',

  selectors: {
    '&:hover': {
      textDecoration: 'none',
    },
    '&:focus': {
      outline: 0,
    },
    [`&${toggleSwitchDisabled}`]: {
      cursor: 'default',
    },
  },

  '@media': {
    print: {
      display: 'none !important',
    },
  },
})

export const toggleSwitchWide = style({
  width: '100%',
})

export const text = style({
  selectors: {
    [`${toggleSwitchHiddenLabel} > &`]: {
      // Same as .visually-hidden
      position: 'absolute',
      height: '1px',
      width: '1px',
      overflow: 'hidden',
      clip: 'rect(1px, 1px, 1px, 1px)',
      whiteSpace: 'nowrap',
    },
  },
})

export const knob = style({
  fontSize: spacing[1],
  width: '5.5em',
  height: '3em',
  borderRadius: '1.5em',
  color: color.blue400,

  transition: 'all .1s linear',
  border: `1px solid ${color.blue200}`,
  backgroundColor: color.white,

  order: 1,
  flexShrink: 0,
  alignSelf: 'flex-start',
  marginLeft: '2em',

  display: 'flex',
  padding: '0 calc(0.5em - 1px)',
  alignItems: 'center',

  selectors: {
    [`${toggleSwitchLarge} > &`]: {
      fontSize: spacing[2],
    },
    [`${toggleSwitchChecked} > &`]: {
      backgroundColor: 'currentColor',
    },
    [`${toggleSwitch}:hover > &`]: {
      color: color.blueberry400,
      borderColor: 'currentColor',
    },
    [`${toggleSwitch}:focus > &, input[type="checkbox"]:focus + &`]: {
      outline: `3px solid ${color.mint400}`,
      borderColor: 'transparent',
    },

    [`${toggleSwitchDisabled} > &`]: {
      color: color.blue200,
    },

    '&::before': {
      content: '""',
      width: '2em',
      height: '2em',
      flexShrink: 0,
      borderRadius: '1em',
      backgroundColor: 'currentColor',
      transition: 'margin-left 250ms ease-in-out',
    },
    [`${toggleSwitchChecked} > &::before`]: {
      backgroundColor: color.white,
      marginLeft: 'calc(2.5em - 1px)',
    },
  },
})
