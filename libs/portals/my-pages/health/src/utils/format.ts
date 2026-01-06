import { amountFormat } from '@island.is/portals/my-pages/core'
import isNumber from 'lodash/isNumber'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

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

// Formats a date string to "Month year" format, if date is undefined, return title as backup
export const formatDateToMonthString = (title: string, date?: string) => {
  // If no date is provided, return the title as is
  if (!date) return title
  const parsedDate = new Date(date)
  const formatted = [
    format(parsedDate, 'LLLL', {
      locale: is,
    })
      .charAt(0)
      .toUpperCase() +
      format(parsedDate, 'LLLL', {
        locale: is,
      }).slice(1),
    parsedDate.getFullYear(),
  ].join(' ')
  return formatted
}
