import { style, styleMap, globalStyle } from 'treat'
import mapValues from 'lodash/mapValues'
import { Theme, theme, themeUtils } from '@island.is/island-ui/theme'


const bla = {
  9: `repeat(9, 1fr)`,
  12: `repeat(12, 1fr)`,
} as const

type Columns = Record<keyof typeof bla, string>

const makeSpan = (breakpoint: keyof Theme['breakpoints']) =>
  styleMap(
    mapValues(bla, (rows) =>
      themeUtils.responsiveStyle({
        [breakpoint]: { gridTemplateRows: `${rows}` },
      }),
    ),
    `span_${breakpoint}`,
  ) as Columns

export const columnsXs = makeSpan('xs')
export const columnsSm = makeSpan('sm')
export const columnsMd = makeSpan('md')
export const columnsLg = makeSpan('lg')
export const columnsXl = makeSpan('xl')

export const grid = style({
  boxSizing: 'border-box',
  display: 'flex',
  flex: '0 1 auto',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginRight: `-${theme.grid.gutter.mobile}px`,
  marginLeft: `-${theme.grid.gutter.mobile}px`,

  '@media': {
    [`screen and min-width(${theme.breakpoints.md}px)`]: {
      paddingRight: `-${theme.grid.gutter.desktop}px`,
      paddingLeft: `-${theme.grid.gutter.desktop}px`,
    },
  },
})
