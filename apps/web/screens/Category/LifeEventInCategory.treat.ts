import { style, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const thumbnail = style({
  backgroundSize: 'contain',
  backgroundPosition: 'right',
  backgroundRepeat: 'no-repeat',
  width: '100%',
  minHeight: 180,
  flex: 'none',
  display: 'block',
})

export const textWrapper = style({
  height: '100%',
})

export const pushDown = style({
  marginTop: 'auto',
})
