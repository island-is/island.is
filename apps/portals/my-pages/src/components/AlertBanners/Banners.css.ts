import { zIndex } from '@island.is/portals/my-pages/constants'
import { style } from '@vanilla-extract/css'

export const container = style({
  zIndex: zIndex.header + 10,
})
