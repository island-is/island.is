import { style, styleVariants } from '@vanilla-extract/css'
import omit from 'lodash/omit'
import { mapToStyleProperty } from '../../utils/mapToStyleProperty'
import { theme, themeUtils } from '@island.is/island-ui/theme'

// Omitted because 'auto' negative margin doesn't make sense
const spacing = omit(theme.spacing, 'auto')
const preventCollapse = 1

const negativeMarginTop = (spacing: number, rows: number) => ({
  ':before': { marginTop: -(spacing * rows) - preventCollapse },
})

export const base = style({
  paddingTop: preventCollapse,
  ':before': { content: '""', display: 'block' },
})

export const xs = styleVariants(
  mapToStyleProperty({ ...spacing }, 'marginTop', (rows) =>
    negativeMarginTop(1, rows),
  ),
)
export const sm = styleVariants(
  mapToStyleProperty({ ...spacing }, 'marginTop', (rows) =>
    themeUtils.responsiveStyle({ sm: negativeMarginTop(1, rows) }),
  ),
)
export const md = styleVariants(
  mapToStyleProperty({ ...spacing }, 'marginTop', (rows) =>
    themeUtils.responsiveStyle({ md: negativeMarginTop(1, rows) }),
  ),
)
export const lg = styleVariants(
  mapToStyleProperty({ ...spacing }, 'marginTop', (rows) =>
    themeUtils.responsiveStyle({ lg: negativeMarginTop(1, rows) }),
  ),
)
export const xl = styleVariants(
  mapToStyleProperty({ ...spacing }, 'marginTop', (rows) =>
    themeUtils.responsiveStyle({ xl: negativeMarginTop(1, rows) }),
  ),
)
