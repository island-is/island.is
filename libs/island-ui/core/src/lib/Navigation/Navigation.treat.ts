import { style, styleMap, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const divider = style({
  width: '100%',
  height: 1,
})

export const root = style({})

export const ul = style({
  borderLeftWidth: 1,
  borderLeftStyle: 'solid',
  borderLeftColor: theme.color.transparent,
})

export const colorScheme = styleMap({
  blue: {},
  purple: {},
  darkBlue: {},
})

export const link = style({
  ':hover': {
    textDecoration: 'none',
  },
})

export const level = styleMap({
  1: {
    padding: 0,
  },
  2: {
    marginTop: theme.spacing[1],
    marginBottom: theme.spacing[1],
    marginLeft: theme.spacing[3],
    marginRight: theme.spacing[3],
  },
})
