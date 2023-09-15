import isNumber from 'lodash/isNumber'

export const formatNumberToString = (item?: number) => {
  return isNumber(item) ? item.toString() : ''
}

export const formatHealthCenterMessage = (
  message: string,
  healthCenter: string,
) => {
  return message.replace('{healthCenter}', healthCenter)
}

const POSTFIX = '-'
export const formatHealthCenterName = (name: string) => {
  return name.split(POSTFIX)[0]
}
