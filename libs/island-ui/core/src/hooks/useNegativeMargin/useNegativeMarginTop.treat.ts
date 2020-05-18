import { style, styleMap } from 'treat'
import { mapToStyleProperty } from '../../utils'
import { theme } from '../../theme/index'
import { makeThemeUtils } from '../../themeUtils'

const utils = makeThemeUtils(theme)

const preventCollapse = 1

const negativeMarginTop = (grid: number, rows: number) => ({
  ':before': { marginTop: -(grid * rows) - preventCollapse },
})

export const base = style({
  paddingTop: preventCollapse,
  ':before': { content: '""', display: 'block' },
})

export const xs = styleMap(
  mapToStyleProperty({ none: 0, ...theme.space }, 'marginTop', (rows) =>
    negativeMarginTop(theme.grid, rows),
  ),
)
export const sm = styleMap(
  mapToStyleProperty({ none: 0, ...theme.space }, 'marginTop', (rows) =>
    utils.responsiveStyle({ sm: negativeMarginTop(theme.grid, rows) }),
  ),
)
export const md = styleMap(
  mapToStyleProperty({ none: 0, ...theme.space }, 'marginTop', (rows) =>
    utils.responsiveStyle({ md: negativeMarginTop(theme.grid, rows) }),
  ),
)
export const lg = styleMap(
  mapToStyleProperty({ none: 0, ...theme.space }, 'marginTop', (rows) =>
    utils.responsiveStyle({ lg: negativeMarginTop(theme.grid, rows) }),
  ),
)
export const xl = styleMap(
  mapToStyleProperty({ none: 0, ...theme.space }, 'marginTop', (rows) =>
    utils.responsiveStyle({ xl: negativeMarginTop(theme.grid, rows) }),
  ),
)
