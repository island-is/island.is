import { style, globalStyle } from '@vanilla-extract/css'

const scaleFactor = 1.7 // Adjust this value to make the calendar larger or smaller

export const calendar = style({
  fontSize: `${16 * scaleFactor}px`, // Base font size
})

globalStyle(`${calendar} .rmdp-wrapper`, {
  width: `${300 * scaleFactor}px`,
  padding: 5,
})

globalStyle(`${calendar} .rmdp-header-values`, {
  fontSize: `${14 * scaleFactor}px`,
  height: `${40 * scaleFactor}px`,
})

globalStyle(`${calendar} .rmdp-week-day`, {
  height: `${35 * scaleFactor}px`,
  fontSize: `${13 * scaleFactor}px`,
})

globalStyle(`${calendar} .rmdp-day`, {
  width: `${35 * scaleFactor}px`,
  height: `${35 * scaleFactor}px`,
})

globalStyle(`${calendar} .rmdp-day span`, {
  fontSize: `${14 * scaleFactor}px`,
})

globalStyle(`${calendar} .rmdp-arrow-container`, {
  width: `${30 * 1.2}px`,
  height: `${30 * 1.2}px`,
})

// globalStyle(`${calendar} .rmdp-arrow`, {
//   borderWidth: `${2 * scaleFactor}px`,
// });

globalStyle(`${calendar} .rmdp-panel-body::-webkit-scrollbar`, {
  width: `${5 * scaleFactor}px`,
})
