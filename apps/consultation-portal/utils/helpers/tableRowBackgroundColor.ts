import isEvenCheck from './isEvenCheck'

export const tableRowBackgroundColor = (idx: number) => {
  return isEvenCheck(idx) ? 'blue100' : 'transparent'
}

export default tableRowBackgroundColor
