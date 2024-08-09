import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const wrapper = style({
  width: '100%',
})

export const docline = style({
  paddingTop: theme.spacing.smallGutter * 3,
  paddingBottom: theme.spacing.smallGutter * 3,
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue100,
    },
  },
})

export const active = style({
  backgroundColor: theme.color.blue100,
})

export const unread = style({
  backgroundColor: theme.color.blueberry100,
})

export const docLineButton = style({
  overflow: 'hidden',
  cursor: 'pointer',
})

export const button = style({})

export const image = style({
  width: 28,
  height: 28,
})

export const fakeBorder = style({
  height: '100%',
  width: 3,
  background: theme.color.blue400,
  position: 'absolute',
  left: 0,
  top: 0,
  margin: 'auto',
})

export const imageContainer = style({
  minWidth: 48,
  minHeight: 48,
  maxHeight: 48,
  maxWidth: 48,
  transition: 'background-color .25s',
})

export const largeAvatar = style({
  ...themeUtils.responsiveStyle({
    lg: {
      minWidth: 56,
      minHeight: 56,
      maxHeight: 56,
      maxWidth: 56,
    },
  }),
})

export const checkCircle = style({
  minWidth: 30,
  minHeight: 30,
  maxHeight: 30,
  maxWidth: 30,
  transition: 'background-color .25s',
})
