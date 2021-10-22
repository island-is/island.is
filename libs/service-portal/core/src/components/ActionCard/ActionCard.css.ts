import { style, keyframes } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  transition: 'border-color 200ms',
  ':hover': {
    borderColor: theme.color.blue300,
  },
})

// The line on text buttons overflows it's element,
// resulting in uneven alignment
export const buttonWrapper = style({
  paddingBottom: 2,
})

export const isLoadingContainer = style({
  opacity: 0.85,
  animationName: keyframes({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 0.85,
    },
  }),
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
})
