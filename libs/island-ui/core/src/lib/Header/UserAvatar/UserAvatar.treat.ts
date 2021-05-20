import { style } from 'treat'

import { theme, responsiveStyleMap } from '@island.is/island-ui/theme'

export const avatar = style({
  flex: 'none',

  marginTop: -6,
  marginBottom: -6,
  marginLeft: -8,

  width: 56,
  height: 56,
})

export const avatarResize = responsiveStyleMap({
  width: { xs: 28, md: 56 },
  height: { xs: 28, md: 56 },
})

export const initials = style({
  color: theme.color.blue400,

  fontSize: 24,
  fontWeight: 600,
})

export const initialsResize = responsiveStyleMap({
  fontSize: {
    xs: 14,
    md: 24,
  },
})
