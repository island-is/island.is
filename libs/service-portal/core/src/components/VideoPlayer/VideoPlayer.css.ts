import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  maxWidth: '546px',
  aspectRatio: '1.55/1',
  borderRadius: theme.border.radius.large,
  borderWidth: theme.border.width.large,
  borderStyle: theme.border.style.solid,
  borderColor: theme.border.color.blue200,

  ':fullscreen': {
    aspectRatio: '16/9',
    width: 'auto',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    border: 'none',
  },
})
export const video = style({
  borderRadius: theme.border.radius.large,
  background: theme.color.blue100,
  paddingTop: theme.spacing[1],
  paddingBottom: theme.spacing[1],
  columnGap: theme.spacing[1],
})

export const controls = style({
  position: 'absolute',
  bottom: 0,
  overflow: 'hidden',
  maxWidth: '546px',
})

export const audioControl = style({
  padding: `0 ${theme.spacing[1]}px`,
})

export const videoPlayer = style({
  maxWidth: '100%',
})

export const hidden = style({
  display: 'none',
})

export const fullscreen = style({
  maxWidth: '50vw',
})
