import { style, globalStyle } from 'treat'
import { themeUtils, theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  position: 'relative',
  overflow: 'visible',
  marginTop: 24,
  marginLeft: 0,
  ...themeUtils.responsiveStyle({
    md: {
      marginTop: 77,
      marginLeft: 0,
    },
  }),
})

export const item = style({
  display: 'flex',
  minWidth: '100%',
  paddingRight: 24,
  flexFlow: 'column',
})

export const arrowButton = style({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  width: 40,
  height: 40,
  backgroundColor: theme.color.blue400,
  borderRadius: '50%',
  outline: 0,
  opacity: 1,
  transition: `all 300ms ease`,
})

export const arrowButtonDisabled = style({
  pointerEvents: 'none',
  opacity: 0.25,
  transition: `all 150ms ease`,
})

export const controls = style({
  position: 'absolute',
  top: 0,
  right: 0
})

globalStyle(`${wrapper} .alice-carousel__wrapper`, {
  overflow: 'visible',
})
