import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { zIndex } from '@island.is/service-portal/constants'
import { alignItems } from 'libs/island-ui/core/src/lib/Box/useBoxStyles.treat'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: zIndex.modal,
})

export const innerContainer = style({
  border: '1px dashed #99C0FF', //TODO FIX COLOR
  borderRadius: '5px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const modal = style({
  position: 'relative',
  borderRadius: '16px',
  boxSizing: 'border-box',
  backgroundColor: theme.color.white,
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
  '@keyframes': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
})

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: '70%',
  '@keyframes': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 0.7,
    },
  },
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
})

export const modalClose = style({
  background: theme.color.dark100,
  borderRadius: '30px',
  width: 44,
  height: 44,
  lineHeight: 0,
  outline: 0,
})
