import { globalStyle, style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

const gridContainerBase = {
  display: 'grid',
  gap: theme.spacing[2],
  ...themeUtils.responsiveStyle({
    md: {
      gap: theme.spacing[3],
    },
  }),
  justifyContent: 'stretch',
}

export const gridContainerOneColumn = style({
  ...gridContainerBase,
  gridTemplateColumns: '1fr',
})

export const gridContainerTwoColumn = style({
  ...gridContainerBase,
  gridTemplateColumns: '1fr 1fr',
})

export const gridContainerThreeColumn = style({
  ...gridContainerBase,
  gridTemplateColumns: '1fr 1fr 1fr',
})

export const iconBox = style({})

globalStyle(`${iconBox} > svg`, {
  minWidth: 24,
})

export const preLine = style({
  whiteSpace: 'pre-line',
})
