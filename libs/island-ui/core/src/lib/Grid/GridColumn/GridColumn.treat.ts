import { styleMap, style } from 'treat'
import mapValues from 'lodash/mapValues'
import { themeUtils, Theme, theme } from '@island.is/island-ui/theme'

const ColumnRange = [
  '12/12',
  '11/12',
  '10/12',
  '9/12',
  '8/12',
  '7/12',
  '6/12',
  '5/12',
  '4/12',
  '3/12',
  '2/12',
  '1/12',
  '11/11',
  '10/11',
  '9/11',
  '8/11',
  '7/11',
  '6/11',
  '5/11',
  '4/11',
  '3/11',
  '2/11',
  '1/11',
  '10/10',
  '9/10',
  '8/10',
  '7/10',
  '6/10',
  '5/10',
  '4/10',
  '3/10',
  '2/10',
  '1/10',
  '9/9',
  '8/9',
  '7/9',
  '6/9',
  '5/9',
  '4/9',
  '3/9',
  '2/9',
  '1/9',
  '8/8',
  '7/8',
  '6/8',
  '5/8',
  '4/8',
  '3/8',
  '2/8',
  '1/8',
  '7/7',
  '6/7',
  '5/7',
  '4/7',
  '3/7',
  '2/7',
  '1/7',
  '6/6',
  '5/6',
  '4/6',
  '3/6',
  '2/6',
  '1/6',
  '5/5',
  '4/5',
  '3/5',
  '2/5',
  '1/5',
  '4/4',
  '3/4',
  '2/4',
  '1/4',
  '3/3',
  '2/3',
  '1/3',
  '2/2',
  '1/2',
  '1/1',
  '0',
] as const
const orderRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
export type Order = typeof orderRange[number]
export type GridColumns = typeof ColumnRange[number] | '0'
type Columns = Record<GridColumns, string>
type Orders = Record<Order, string>
type Breakpoint = keyof Theme['breakpoints']
const order = orderRange.reduce((acc: Record<string, number>, o) => {
  acc[o.toString()] = o
  return acc
}, {})
const columns = ColumnRange.reduce((acc, column) => {
  const range = column.split('/')
  if (column === '0') {
    acc[column] = '0'
  }
  if (range.length !== 2 || isNaN(parseInt(range[0]) / parseInt(range[1]))) {
    return acc
  }
  acc[column] = `${(parseInt(range[0]) / parseInt(range[1])) * 100}%`
  return acc
}, {} as Columns)

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

const makeOrder = (breakpoint: Breakpoint) =>
  styleMap(
    mapValues(order, (order) =>
      themeUtils.responsiveStyle({ [breakpoint]: { order } }),
    ),
    `order_${breakpoint}:${order}`,
  ) as Orders

export const orderXs = makeOrder('xs')
export const orderSm = makeOrder('sm')
export const orderMd = makeOrder('md')
export const orderLg = makeOrder('lg')
export const orderXl = makeOrder('xl')

// Treat gotcha:
// The style order matters.
// `base` has to be at the bottom because it uses a media query.
export const base = style({
  paddingRight: theme.grid.gutter.mobile / 2,
  paddingLeft: theme.grid.gutter.mobile / 2,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      paddingRight: theme.grid.gutter.desktop / 2,
      paddingLeft: theme.grid.gutter.desktop / 2,
    },
  },
})
