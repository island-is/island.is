import { theme } from '@island.is/island-ui/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const container = style({})

//TODO: Currently overriding the default p in markdown is removing link styles, we need to override global styles until we have a solution for overriding p with the Text component
globalStyle(`${container} p`, {
  fontWeight: theme.typography.light,
  lineHeight: 1.5,
  ['-webkit-font-smoothing' as string]: 'antialiased',
})
