import { styleMap, style } from 'treat'
import mapValues from 'lodash/mapValues'
import { themeUtils, Theme, theme } from '@island.is/island-ui/theme'

const columns = {
  '1/12': `${(1 / 12) * 100}%`,
  '2/12': `${(2 / 12) * 100}%`,
  '3/12': `${(3 / 12) * 100}%`,
  '4/12': `${(4 / 12) * 100}%`,
  '5/12': `${(5 / 12) * 100}%`,
  '6/12': `${(6 / 12) * 100}%`,
  '7/12': `${(7 / 12) * 100}%`,
  '8/12': `${(8 / 12) * 100}%`,
  '9/12': `${(9 / 12) * 100}%`,
  '10/12': `${(10 / 12) * 100}%`,
  '11/12': `${(11 / 12) * 100}%`,
  '12/12': `${(11 / 12) * 100}%`,
  '1/9': `${(1 / 9) * 100}%`,
  '2/9': `${(2 / 9) * 100}%`,
  '3/9': `${(3 / 9) * 100}%`,
  '4/9': `${(4 / 9) * 100}%`,
  '5/9': `${(5 / 9) * 100}%`,
  '6/9': `${(6 / 9) * 100}%`,
  '7/9': `${(7 / 9) * 100}%`,
  '8/9': `${(8 / 9) * 100}%`,
  '9/9': `${(9 / 9) * 100}%`,
} as const

export type GridColumns = keyof typeof columns
type Columns = Record<GridColumns, string>
type Breakpoint = keyof Theme['breakpoints']

const makeSpan = (breakpoint: Breakpoint) =>
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

const makeOffset = (breakpoint: Breakpoint) =>
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

// Treat gotcha:
// The style order matters.
// `base` has to be at the bottom because it uses a media query.
export const base = style({
  paddingRight: theme.grid.gutter.mobile / 2,
  paddingLeft: theme.grid.gutter.mobile / 2,
  position: 'relative',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      paddingRight: theme.grid.gutter.desktop / 2,
      paddingLeft: theme.grid.gutter.desktop / 2,
    },
  },
})
