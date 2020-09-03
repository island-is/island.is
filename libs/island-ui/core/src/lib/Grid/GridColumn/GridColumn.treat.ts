import { styleMap, style } from 'treat'
import mapValues from 'lodash/mapValues'
import { themeUtils, Theme, theme } from '@island.is/island-ui/theme'

function makeColumns() {
  const bucket = {}

  for (let i = 12; i > 0; i--) {
    for (let x = i; x > 0; x--) {
      Object.assign(bucket, {
        [`${x}/${i}`]: `(${x} / ${i}) * ${100}%`,
      })
    }
  }

  return bucket
}

const columns = makeColumns()

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
