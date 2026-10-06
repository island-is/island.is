import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

// The "Eða skráðu þig inn með" divider from the identity server's login screen.
export const textBackgroundLine = style({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 'calc(50% + 1px)',
  height: 1,
  width: '100%',
  backgroundColor: theme.color.blue200,
})

export const textWrapper = style({
  position: 'relative',
  display: 'inline-block',
  paddingLeft: theme.spacing[2],
  paddingRight: theme.spacing[2],
  background: theme.color.white,
})
