import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  width: '546px',
  height: '352px',
  borderRadius: theme.border.radius.large,
  border: '2px solid',
  borderColor: theme.color.blue200,
})
export const video = style({
  borderRadius: theme.border.radius.large,
  background: theme.color.blue100,
  paddingTop: theme.spacing[1],
  paddingBottom: theme.spacing[1],
})

export const controls = style({
  position: 'absolute',
  bottom: 0,
  maxWidth: '100%',
  overflow: 'hidden',
})

export const videoPlayer = style({
  maxWidth: '100%',
  '@media': {
    'all and (display-mode: fullscreen)': {
      maxWidth: '560px',
    },
  },
})

export const hidden = style({
  display: 'none',
})
