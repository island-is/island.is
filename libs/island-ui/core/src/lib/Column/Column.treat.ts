import { style, styleMap } from 'treat'
import mapValues from 'lodash/mapValues'
import { themeUtils, Theme } from '@island.is/island-ui/theme'

type Breakpoint = keyof Theme['breakpoints']

export const column = style({})

export const columnContent = style({
  selectors: {
    [`${column}:first-child > &`]: {
      paddingTop: 0,
    },
  },
})

const availableWidths = [
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
  '4/5',
  '3/5',
  '2/5',
  '1/5',
  '3/4',
  '1/4',
  '2/3',
  '1/3',
  '1/2',
  'content',
] as const

export type AvailableWidths = typeof availableWidths[number]

const widths = availableWidths.reduce((acc, column) => {
  if (column === 'content') {
    acc[column] = 'content'
    return acc
  }
  const range = column.split('/')

  acc[column] = parseInt(range[0]) / parseInt(range[1])
  return acc
}, {})

const makeWidth = (breakpoint: Breakpoint) =>
  styleMap(
    mapValues(widths, (width) =>
      themeUtils.responsiveStyle({
        [breakpoint]:
          width === 'content'
            ? { flex: 'initial', flexShrink: 0, width: 'auto' }
            : { flex: `0 0 ${width * 100}%`, width: '100%' },
      }),
    ),
    `columnWidth_${breakpoint}`,
  ) as any

export const widthXs = makeWidth('xs')
export const widthSm = makeWidth('sm')
export const widthMd = makeWidth('md')
export const widthLg = makeWidth('lg')
export const widthXl = makeWidth('xl')
