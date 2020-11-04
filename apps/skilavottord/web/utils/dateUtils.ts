import parse from 'date-fns/parse'
import format from 'date-fns/format'

export const formatYear = (dateTime: string, dateFormat: string) => {
  return parse(dateTime, dateFormat, new Date()).getFullYear()
}

export const getDate = (dateTime: string) => {
  const time = new Date(dateTime)
  return format(time, 'yyyy-MM-dd')
}

export const getTime = (dateTime: string) => {
  const time = new Date(dateTime)
  return format(time, 'hh:mm')
}
