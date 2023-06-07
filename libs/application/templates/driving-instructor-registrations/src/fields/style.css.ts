import { style, keyframes } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

const icon = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
})

const bgr = keyframes({
  '0%': { background: theme.color.mint100 },
  '100%': { background: theme.color.transparent },
})

export const showSuccessIcon = style({
  animation: `10s ${icon}`,
  opacity: 0,
  position: 'absolute',
  right: 25,

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      display: 'none',
    },
  },
})

export const successBackground = style({
  animation: `10s ${bgr}`,
})

export const editingBackground = style({
  background: theme.color.purple100,
})

export const transparentBackground = style({
  background: theme.color.transparent,
})

export const modalStyle = style({
  display: 'flex',
  justifyContent: 'center',
  position: 'absolute',
  top: '35%',

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      top: '10%',
    },
  },
})

export const mobileWidth = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      width: '100%',
      display: 'block',
    },
  },
})

export const hideRow = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      display: 'none',
    },
  },
})

export const tableStyles = {
  paddingLeft: '14px',
  paddingRight: '14px',
}
