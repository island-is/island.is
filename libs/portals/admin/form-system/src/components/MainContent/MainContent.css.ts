import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

const MOBILE = `screen and (max-width: ${theme.breakpoints.md}px)`

export const identifierToggle = style({})

globalStyle(`${identifierToggle} > div`, {
  order: 0,
  marginLeft: 0,
  marginRight: theme.spacing[2],
})

export const mainContent = style({
  border: `1px solid ${theme.border.color.blue200}`,
  borderRadius: theme.border.radius.standard,
  width: '100%',
  height: '100%',
  marginTop: '50px',
  '@media': {
    [MOBILE]: {
      marginTop: '16px',
    },
  },
})
