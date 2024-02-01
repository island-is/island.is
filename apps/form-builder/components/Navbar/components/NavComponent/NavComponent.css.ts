import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

const base = style({
  border: `1px solid ${theme.border.color.blue200}`,
  borderRadius: theme.border.radius.standard,
  marginBottom: '2px',
  height: '46px',
  marginLeft: 'auto',
  backgroundColor: theme.color.blue100,
  lineHeight: '46px',
  ':hover': {
    fontWeight: 'bolder',
  },
  cursor: 'grab',
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
    },
  ],
  group: [
    base,
    {
      width: '90%',
    },
  ],
  input: [
    base,
    {
      width: '80%',
    },
  ],
})

const baseBackground = style({
  width: '25px',
  height: '44px',
  /* top-left | top-right | bottom-right | bottom-left */
  borderRadius: `${theme.border.radius.standard} 0 0 ${theme.border.radius.standard}`,
  textAlign: 'center',
})

export const navBackgroundActive = styleVariants({
  step: [
    baseBackground,
    {
      backgroundColor: theme.color.blue600,
      lineHeight: '45px',
      //textAlign: 'center',
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
      //textAlign: 'center',
    },
  ],
  group: [baseBackground, {}],
  input: [baseBackground, {}],
})

export const customBackgroundDropdown = style({
  background: theme.color.blue100,
})
