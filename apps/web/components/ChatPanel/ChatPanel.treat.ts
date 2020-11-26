import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const root = style({
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'fixed',
  zIndex: 9999,
  outline: 0,
  border: 'none',
  borderRadius: '100%',
  color: 'white',
  bottom: theme.spacing[15],
  right: theme.spacing[3],
  ...themeUtils.responsiveStyle({
    md: {
      bottom: theme.spacing[6],
      right: theme.spacing[6],
    },
  }),
  transition: 'opacity 0.3s ease',
})

export const hidden = style({
  opacity: 0,
  zIndex: 0,
})
