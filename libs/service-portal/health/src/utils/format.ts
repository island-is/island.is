import isNumber from 'lodash/isNumber'

export const formatNumberToString = (item?: number) => {
  return isNumber(item) ? item.toString() : ''
}
