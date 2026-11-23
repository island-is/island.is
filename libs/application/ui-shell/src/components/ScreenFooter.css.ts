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

export const sticky = style({
  position: 'sticky',
  // -1px makes the footer slightly overflow the viewport while pinned, which is how ScreenFooter detects it is stuck
  bottom: -1,
  // Content such as the ReviewGroup edit buttons uses zIndex.header, and must scroll underneath
  zIndex: theme.zIndex.aboveHeader,
  background: theme.color.white,
  transition: 'box-shadow 150ms ease',

  // Below md the form fills the screen, so let the footer bleed past the GridContainer padding
  marginLeft: -theme.spacing[2],
  marginRight: -theme.spacing[2],
  paddingLeft: theme.spacing[2],
  paddingRight: theme.spacing[2],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      marginLeft: -theme.spacing[3],
      marginRight: -theme.spacing[3],
      paddingLeft: theme.spacing[3],
      paddingRight: theme.spacing[3],
    },
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: 0,
      marginRight: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
})

// Applied while the footer is detached from its natural position, i.e. there is more content below
export const stuck = style({
  // Negative spread equal to the blur keeps the shadow off the left and right edges
  boxShadow: '0 -10px 12px -12px rgba(0, 0, 0, 0.16)',
})

export const linkNoStyle = style({
  ':hover': {
    textDecoration: 'none',
  },
})
