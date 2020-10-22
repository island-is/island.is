import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { mapToStyleProperty } from '../../../utils/mapToStyleProperty'

export const gridRow = style({
  boxSizing: 'border-box',
  display: 'flex',
  flex: '0 1 auto',
  flexWrap: 'wrap',
  marginLeft: `-${theme.grid.gutter.mobile / 2}px`,
  marginRight: `-${theme.grid.gutter.mobile / 2}px`,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: `-${theme.grid.gutter.desktop / 2}px`,
      marginRight: `-${theme.grid.gutter.desktop / 2}px`,
    },
  },
})

const alignRules = {
  center: 'center',
  end: 'flexEnd',
  normal: 'normal',
  spaceAround: 'spaceAround',
  spaceBetween: 'spaceBetween',
  start: 'flexStart',
}

export const align = styleMap(mapToStyleProperty(alignRules, 'justifyContent'))
