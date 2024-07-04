import { amountFormat } from '@island.is/service-portal/core'
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

export const totalNumber = <T extends Record<string, unknown>>(
  data: Array<T>,
  item: keyof T & string,
) =>
  amountFormat(
    data?.reduce((a, b) => {
      const value = b?.[item]
      return typeof value === 'number' ? a + value : a
    }, 0) ?? 0,
  )
