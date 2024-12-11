import { globalStyle, style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

const lineWidth = '2px'

export const line = style({
  borderRight: `${lineWidth} solid ${theme.color.blue200}`,
  height: '86px',
})

export const longLine = style({
  borderLeft: `${lineWidth} solid ${theme.color.blue200}`,
})

export const text2025Container = style({
  ...themeUtils.responsiveStyle({
    xs: {
      maxWidth: '180px',
    },
    md: {
      maxWidth: '200px',
    },
  }),
})

export const highlightedItemsContainer = style({
  display: 'grid',
  ...themeUtils.responsiveStyle({
    xs: {
      gridTemplateColumns: '1fr',
      gap: theme.spacing[4],
    },
    lg: {
      gridTemplateColumns: '1fr auto 1fr',
      gap: theme.spacing[7],
    },
  }),
})

export const fullWidth = style({
  width: '100%',
})

export const textMaxWidth = style({
  maxWidth: '793px',
})

globalStyle('tbody', {
  borderBottom: '32px solid white',
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: `140px ${lineWidth} auto`,
})

export const fitContent = style({
  width: 'fit-content',
})

export const alignSelfToFlexEnd = style({
  alignSelf: 'flex-end',
})

export const hiddenOnScreen = style({
  '@media': {
    screen: {
      display: 'none',
    },
    print: {
      display: 'block',
    },
  },
})
