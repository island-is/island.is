import { style, keyframes } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const buttonContainer = style({
  gap: theme.spacing[2],
})

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

const fadeOut = keyframes({
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
})

export const commentVisible = style({
  animation: `${fadeIn} 0.5s forwards`,
})

export const commentHidden = style({
  animation: `${fadeOut} 0.5s forwards`,
})
