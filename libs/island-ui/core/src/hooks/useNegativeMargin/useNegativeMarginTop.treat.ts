import { style, styleMap } from 'treat'
import { mapToStyleProperty } from '../../utils'
import { theme, themeUtils } from '@island.is/island-ui/theme'

const preventCollapse = 1

const negativeMarginTop = (spacing: number, rows: number) => ({
  ':before': { marginTop: -(spacing * rows) - preventCollapse },
})

export const base = style({
  paddingTop: preventCollapse,
  ':before': { content: '""', display: 'block' },
})

export const xs = styleMap(
  mapToStyleProperty({ ...theme.spacing }, 'marginTop', (rows) =>
    negativeMarginTop(1, rows),
  ),
)
export const sm = styleMap(
  mapToStyleProperty({ ...theme.spacing }, 'marginTop', (rows) =>
    themeUtils.responsiveStyle({ sm: negativeMarginTop(1, rows) }),
  ),
)
export const md = styleMap(
  mapToStyleProperty({ ...theme.spacing }, 'marginTop', (rows) =>
    themeUtils.responsiveStyle({ md: negativeMarginTop(1, rows) }),
  ),
)
export const lg = styleMap(
  mapToStyleProperty({ ...theme.spacing }, 'marginTop', (rows) =>
    themeUtils.responsiveStyle({ lg: negativeMarginTop(1, rows) }),
  ),
)
export const xl = styleMap(
  mapToStyleProperty({ ...theme.spacing }, 'marginTop', (rows) =>
    themeUtils.responsiveStyle({ xl: negativeMarginTop(1, rows) }),
  ),
)
