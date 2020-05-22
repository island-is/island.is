import { style, styleMap } from 'treat'
import { mapToStyleProperty } from '../../utils'
import { theme } from '../../theme/index'
import { makeThemeUtils } from '../../themeUtils'

const utils = makeThemeUtils(theme)

const preventCollapse = 1

const negativeMarginTop = (spacing: number, rows: number) => ({
  ':before': { marginTop: -(spacing * rows) - preventCollapse },
})

export const base = style({
  paddingTop: preventCollapse,
  ':before': { content: '""', display: 'block' },
})

export const xs = styleMap(
  mapToStyleProperty({ none: 0, ...theme.spacing }, 'marginTop', (rows) =>
    negativeMarginTop(1, rows),
  ),
)
export const sm = styleMap(
  mapToStyleProperty({ none: 0, ...theme.spacing }, 'marginTop', (rows) =>
    utils.responsiveStyle({ sm: negativeMarginTop(1, rows) }),
  ),
)
export const md = styleMap(
  mapToStyleProperty({ none: 0, ...theme.spacing }, 'marginTop', (rows) =>
    utils.responsiveStyle({ md: negativeMarginTop(1, rows) }),
  ),
)
export const lg = styleMap(
  mapToStyleProperty({ none: 0, ...theme.spacing }, 'marginTop', (rows) =>
    utils.responsiveStyle({ lg: negativeMarginTop(1, rows) }),
  ),
)
export const xl = styleMap(
  mapToStyleProperty({ none: 0, ...theme.spacing }, 'marginTop', (rows) =>
    utils.responsiveStyle({ xl: negativeMarginTop(1, rows) }),
  ),
)
