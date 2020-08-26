import { styleMap, style } from 'treat'
import mapValues from 'lodash/mapValues'
import { themeUtils, Theme, theme } from '@island.is/island-ui/theme'

export const base = style({
  flex: '0 0 auto',
  paddingRight: theme.grid.gutter.mobile,
  paddingLeft: theme.grid.gutter.mobile,

  '@media': {
    [`screen and min-width(${theme.breakpoints.md}px)`]: {
      paddingRight: theme.grid.gutter.desktop,
      paddingLeft: theme.grid.gutter.desktop,
    },
  },
})

const makeColumns = () =>
  ({
    1: `${(1 / 12) * 100}%`,
    2: `${(2 / 12) * 100}%`,
    3: `${(3 / 12) * 100}%`,
    4: `${(4 / 12) * 100}%`,
    5: `${(5 / 12) * 100}%`,
    6: `${(6 / 12) * 100}%`,
    7: `${(7 / 12) * 100}%`,
    8: `${(8 / 12) * 100}%`,
    9: `${(9 / 12) * 100}%`,
    10: `${(10 / 12) * 100}%`,
    11: `${(11 / 12) * 100}%`,
    12: `${(12 / 12) * 100}%`,
  } as const)

const columns = makeColumns()
type Columns = Record<keyof typeof columns, string>

const makeSpan = (breakpoint: keyof Theme['breakpoints']) =>
  styleMap(
    mapValues(columns, (span) =>
      themeUtils.responsiveStyle({
        [breakpoint]: { flexBasis: `${span}`, maxWidth: `${span}` },
      }),
    ),
    `span_${breakpoint}`,
  ) as Columns

export const spanXs = makeSpan('xs')
export const spanSm = makeSpan('sm')
export const spanMd = makeSpan('md')
export const spanLg = makeSpan('lg')
export const spanXl = makeSpan('xl')

const makeOffset = (breakpoint: keyof Theme['breakpoints']) =>
  styleMap(
    mapValues(columns, (span) =>
      themeUtils.responsiveStyle({ [breakpoint]: { marginLeft: span } }),
    ),
    `push_${breakpoint}`,
  ) as Columns

export const offsetXs = makeOffset('xs')
export const offsetSm = makeOffset('sm')
export const offsetMd = makeOffset('md')
export const offsetLg = makeOffset('lg')
export const offsetXl = makeOffset('xl')
