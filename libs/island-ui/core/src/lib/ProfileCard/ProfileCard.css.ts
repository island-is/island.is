import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const image = style({
  paddingTop: '69.18238994%',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
})

export const titleAboveContainer = style({
  textAlign: 'center',
  padding: '32px 24px',
  backgroundColor: theme.color.blue100,
})

export const link = style({
  position: 'absolute',
  bottom: '24px',
  left: '24px',
})
