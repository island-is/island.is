import { theme } from '@island.is/island-ui/theme'
import { style, styleVariants } from '@vanilla-extract/css'

const base = style({
  border: `1px solid ${theme.border.color.blue200}`,
  borderRadius: theme.border.radius.standard,
  marginBottom: '2px',
  height: '46px',
  marginLeft: 'auto',
  lineHeight: '46px',
  ':hover': {
    fontWeight: 'bolder',
  },
  cursor: 'pointer',
  flexShrink: 0,
})

export const step = style({
  border: `1px solid ${theme.border.color.blue200}`,
  borderRadius: theme.border.radius.standard,
  marginBottom: '2px',
  height: '46px',
  width: '100%',
})

export const navComponent = styleVariants({
  step: [
    base,
    {
      width: '100%',
      backgroundColor: theme.color.blue100,
    },
  ],
  group: [
    base,
    {
      width: '90%',
      backgroundColor: theme.color.blue100,
    },
  ],
  input: [
    base,
    {
      width: '80%',
      backgroundColor: theme.color.blue100,
    },
  ],
  stepSelect: [
    base,
    {
      width: '100%',
      backgroundColor: theme.color.white,
    },
  ],
  groupSelect: [
    base,
    {
      width: '90%',
      backgroundColor: theme.color.white,
    },
  ],
  inputSelect: [
    base,
    {
      width: '80%',
      backgroundColor: theme.color.white,
    },
  ],
})

const baseBackground = style({
  width: '38px',
  minWidth: '38px',
  height: '44px',
  borderRadius: `${theme.border.radius.standard} 0 0 ${theme.border.radius.standard}`,
  textAlign: 'center',
  flex: '0 0 38px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'grab',
})

export const navBackgroundActive = styleVariants({
  step: [
    baseBackground,
    {
      backgroundColor: theme.color.blue600,
      lineHeight: '45px',
      color: theme.color.white,
    },
  ],
  group: [
    baseBackground,
    {
      backgroundColor: theme.color.roseTinted400,
    },
  ],
  input: [
    baseBackground,
    {
      backgroundColor: theme.color.purple400,
    },
  ],
})

export const navBackgroundDefault = styleVariants({
  step: [
    baseBackground,
    {
      lineHeight: '45px',
    },
  ],
  group: [baseBackground, {}],
  input: [baseBackground, {}],
})

export const customBackgroundDropdown = style({
  background: theme.color.blue100,
})

export const selectableComponent = style({
  paddingTop: '10px',
})

export const chevronStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 42,
  width: 40,

  margin: -12,
})
