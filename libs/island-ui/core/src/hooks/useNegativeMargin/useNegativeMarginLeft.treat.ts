import { styleMap } from 'treat'
import omit from 'lodash/omit'
import { mapToStyleProperty } from '../../utils/mapToStyleProperty'
import { theme, themeUtils } from '@island.is/island-ui/theme'

// Omitted because 'auto' negative margin doesn't make sense
const spacing = omit(theme.spacing, 'auto')

const negativeMarginLeft = (grid: number, rows: number) => ({
  marginLeft: -(grid * rows),
})

export const xs = styleMap({
  ...mapToStyleProperty(spacing, 'marginLeft', (rows) =>
    negativeMarginLeft(1, rows),
  ),
})
export const sm = styleMap(
  mapToStyleProperty({ ...spacing }, 'marginLeft', (rows) =>
    themeUtils.responsiveStyle({ sm: negativeMarginLeft(1, rows) }),
  ),
)
export const md = styleMap(
  mapToStyleProperty({ ...spacing }, 'marginLeft', (rows) =>
    themeUtils.responsiveStyle({ md: negativeMarginLeft(1, rows) }),
  ),
)
export const lg = styleMap(
  mapToStyleProperty({ ...spacing }, 'marginLeft', (rows) =>
    themeUtils.responsiveStyle({ lg: negativeMarginLeft(1, rows) }),
  ),
)
export const xl = styleMap(
  mapToStyleProperty({ ...spacing }, 'marginLeft', (rows) =>
    themeUtils.responsiveStyle({ xl: negativeMarginLeft(1, rows) }),
  ),
)
