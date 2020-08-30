import { style, globalStyle } from 'treat'
import {theme} from '@island.is/island-ui/theme'

export const container = style({})

globalStyle(`${container} p`, {
  margin: `${theme.spacing[2]}px 0`,
})

globalStyle(`${container} h2`, {
  margin: `${theme.spacing[2]}px 0`,
})
