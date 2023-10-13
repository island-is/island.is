import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const image = style({
  objectFit: 'cover',
  width: '100%',
  height: 200,
})

export const container = style({
  overflow: 'hidden',
})
export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  alignItems: 'center',
})

export const content = style({
  display: 'flex',
  height: '100%',
  flexGrow: 1,
  flexDirection: 'column',
  width: '100%',
})
