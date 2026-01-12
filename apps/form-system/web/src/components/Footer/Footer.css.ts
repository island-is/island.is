import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const buttonContainer = style({
  borderTop: `2px solid ${theme.color.purple100}`,
  borderBottomLeftRadius: theme.border.radius.large,
  borderBottomRightRadius: theme.border.radius.large,

  // Add an extra 20px so that when the user clicks the Continue button on a scrolled page on mobile Safari,
  // the chrome doesn't animate up and make them click Continue a second time.
  // https://bugs.webkit.org/show_bug.cgi?id=194235
  paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      paddingBottom: theme.spacing[4],
    },
  },
})

export const linkNoStyle = style({
  ':hover': {
    textDecoration: 'none',
  },
})
