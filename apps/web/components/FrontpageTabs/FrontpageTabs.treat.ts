import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  width: '100%',
  margin: '0 auto',
  maxWidth: '1120px',
  display: 'block',
})

export const link = style({
  ':hover': {
    textDecoration: 'none',
  },
})

export const tabWrapper = style({
  display: 'inline-flex',
})

export const tabContainer = style({
  outline: 0,
})

export const content = style({
  display: 'flex',
  position: 'relative',
  width: '100%',
})

export const tabPanel = style({
  position: 'absolute',
  maxWidth: '660px',
  width: '100%',
  top: 0,
  left: 0,
  right: 0,
  opacity: 0,
  pointerEvents: 'none',
  outline: 0,
  transition: `opacity 300ms ease 0ms`,
})

export const tabPanelVisible = style({
  opacity: 1,
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  pointerEvents: 'initial',
  transition: `opacity 600ms ease 300ms`,
})

export const textItem = style({
  position: 'relative',
  display: 'inline-block',
  transform: `translateX(-25%)`,
  transition: `all 600ms ease`,
})

export const textItemVisible = style({
  opacity: 1,
  transform: `translateY(0)`,
})

export const tabBullet = style({
  width: 8,
  height: 8,
  backgroundColor: theme.color.red200,
  borderRadius: 8,
  marginRight: 16,
  transition: `all 300ms ease`,
})

export const tabBulletSelected = style({
  width: 32,
  backgroundColor: theme.color.red400,
})

export const srOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  border: '0',
})

export const dots = style({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
})

export const image = style({
  display: 'inline-flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
})

export const imageContainer = style({
  position: 'relative',
  display: 'flex',
  overflow: 'hidden',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  ...themeUtils.responsiveStyle({
    xs: {
      display: 'none',
      maxWidth: '220px',
    },
    lg: {
      display: 'flex',
      maxWidth: '300px',
    },
    xl: {
      maxWidth: '440px',
    },
  }),
})
