import { styleMap } from 'treat'
import mapValues from 'lodash/mapValues'
import { theme } from '../../theme/index'
import { makeThemeUtils } from '../../themeUtils'
import { Theme } from 'treat/theme'

const utils = makeThemeUtils(theme)

const columnsWidths = {
  1: '100%',
  2: `${100 / 2}%`,
  3: `${100 / 3}%`,
  4: `${100 / 4}%`,
  5: `${100 / 5}%`,
  6: `${100 / 6}%`,
} as const

// Remove this when 'styleMap' supports numbers as keys and it's been released to sku consumers,
type ColumnWidths = Record<keyof typeof columnsWidths, string>
const makeColumnsAtoms = (breakpoint: keyof Theme['breakpoint']) =>
  styleMap(
    mapValues(columnsWidths, (width) =>
      utils.responsiveStyle({ [breakpoint]: { flex: `0 0 ${width}` } }),
    ),
    `columns_${breakpoint}`,
  ) as ColumnWidths

export const columnsXs = makeColumnsAtoms('xs')
export const columnsSm = makeColumnsAtoms('sm')
export const columnsMd = makeColumnsAtoms('md')
export const columnsLg = makeColumnsAtoms('lg')
export const columnsXl = makeColumnsAtoms('xl')
