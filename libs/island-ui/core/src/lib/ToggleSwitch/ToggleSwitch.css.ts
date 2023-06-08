import { style } from '@vanilla-extract/css'
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
  color: color.dark300,

  transition: 'all .1s linear',
  border: `1px solid currentColor`,
  backgroundColor: 'currentColor',

  order: 1,
  flexShrink: 0,
  alignSelf: 'flex-start',
  marginLeft: '2em',

  display: 'flex',
  padding: '0 calc(0.5em - 1px)',
  alignItems: 'center',

  selectors: {
    // Checked
    [`${toggleSwitchChecked} > &`]: {
      color: color.blue400,
    },

    // Large
    [`${toggleSwitchLarge} > &`]: {
      fontSize: spacing[2],
    },

    // Hover
    [`${toggleSwitch}:hover:not(${toggleSwitchDisabled}) > &`]: {
      color: color.dark400,
    },
    [`${toggleSwitch}${toggleSwitchChecked}:hover:not(${toggleSwitchDisabled}) > &`]:
      {
        color: color.blueberry400,
      },

    // Focus
    [`${toggleSwitch}:focus > &, input[type="checkbox"]:focus + &`]: {
      outline: `3px solid ${color.mint400}`,
      borderColor: 'transparent',
    },

    // Disabled
    [`${toggleSwitchDisabled} > &`]: {
      backgroundColor: color.white,
      borderColor: color.dark200,
    },
    [`${toggleSwitchDisabled}${toggleSwitchChecked} > &`]: {
      color: color.blue300,
      backgroundColor: 'currentColor',
      borderColor: 'currentColor',
    },

    '&::before': {
      content: '""',
      width: '2em',
      height: '2em',
      flexShrink: 0,
      borderRadius: '1em',
      backgroundColor: color.white,
      transition:
        'margin-left 250ms ease-in-out, background-color 250ms ease-in-out',
    },
    [`${toggleSwitchChecked} > &::before`]: {
      backgroundColor: color.white,
      marginLeft: 'calc(2.5em - 1px)',
    },

    [`${toggleSwitchDisabled} > &::before`]: {
      backgroundColor: color.dark300,
    },
    [`${toggleSwitchDisabled}${toggleSwitchChecked} > &::before`]: {
      backgroundColor: color.white,
    },
  },
})
