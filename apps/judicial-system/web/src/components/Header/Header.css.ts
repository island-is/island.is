import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils'

export const gridContainer = style({
  padding: `0`,
})

export const container = responsiveStyleMap({
  height: { xs: 80, md: 112 },
})

export const infoContainer = style({
  ...themeUtils.responsiveStyle({
    md: {
      borderLeftWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme.color.dark100,
    },
  }),
})

export const dropdownItem = style({
  display: 'flex',
  borderTop: `2px solid ${theme.color.blue200}`,
  paddingTop: `${theme.spacing[3]}px`,
})

export const searchButton = style({
  minWidth: '128px',
  padding: `10px ${theme.spacing[2]}px`,
  transition: 'border-color 0.2s ease-in-out',

  selectors: {
    '&:hover': {
      borderColor: theme.color.blue400,
    },
  },
})
