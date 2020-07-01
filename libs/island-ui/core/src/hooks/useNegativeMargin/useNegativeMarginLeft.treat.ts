import { styleMap } from 'treat'
import { mapToStyleProperty } from '../../utils'
import { theme, themeUtils } from '@island.is/island-ui/theme'

const negativeMarginLeft = (grid: number, rows: number) => ({
  marginLeft: -(grid * rows),
})

export const xs = styleMap({
  none: {},
  ...mapToStyleProperty(theme.spacing, 'marginLeft', (rows) =>
    negativeMarginLeft(1, rows),
  ),
})
export const sm = styleMap(
  mapToStyleProperty({ none: 0, ...theme.spacing }, 'marginLeft', (rows) =>
    themeUtils.responsiveStyle({ sm: negativeMarginLeft(1, rows) }),
  ),
)
export const md = styleMap(
  mapToStyleProperty({ none: 0, ...theme.spacing }, 'marginLeft', (rows) =>
    themeUtils.responsiveStyle({ md: negativeMarginLeft(1, rows) }),
  ),
)
export const lg = styleMap(
  mapToStyleProperty({ none: 0, ...theme.spacing }, 'marginLeft', (rows) =>
    themeUtils.responsiveStyle({ lg: negativeMarginLeft(1, rows) }),
  ),
)
export const xl = styleMap(
  mapToStyleProperty({ none: 0, ...theme.spacing }, 'marginLeft', (rows) =>
    themeUtils.responsiveStyle({ xl: negativeMarginLeft(1, rows) }),
  ),
)
