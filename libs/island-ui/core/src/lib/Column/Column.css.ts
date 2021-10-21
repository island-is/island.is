import { style, styleMap } from 'treat'

export const column = style({})

export const columnContent = style({
  selectors: {
    [`${column}:first-child > &`]: {
      paddingTop: 0,
    },
  },
})

const getSizeStyle = (scale: number) => ({
  flex: `0 0 ${scale * 100}%`,
})

export const width = styleMap({
  '1/2': getSizeStyle(1 / 2),
  '1/3': getSizeStyle(1 / 3),
  '2/3': getSizeStyle(2 / 3),
  '1/4': getSizeStyle(1 / 4),
  '3/4': getSizeStyle(3 / 4),
  '1/5': getSizeStyle(1 / 5),
  '2/5': getSizeStyle(2 / 5),
  '3/5': getSizeStyle(3 / 5),
  '4/5': getSizeStyle(4 / 5),
  '1/12': getSizeStyle(1 / 12),
  '2/12': getSizeStyle(2 / 12),
  '3/12': getSizeStyle(3 / 12),
  '4/12': getSizeStyle(4 / 12),
  '5/12': getSizeStyle(5 / 12),
  '6/12': getSizeStyle(6 / 12),
  '7/12': getSizeStyle(7 / 12),
  '8/12': getSizeStyle(8 / 12),
  '9/12': getSizeStyle(9 / 12),
  '10/12': getSizeStyle(10 / 12),
  '11/12': getSizeStyle(11 / 12),
})
