import parse from 'date-fns/parse'
import format from 'date-fns/format'

export const formatYear = (dateTime: string, dateFormat: string) => {
  return parse(dateTime, dateFormat, new Date()).getFullYear()
}

export const formatDate = (dateTime: string, dateFormat: string) => {
  return parse(dateTime, dateFormat, new Date())
}

export const getDate = (dateTime: string) => {
  const date = new Date(dateTime)
  return format(date, 'yyyy-MM-dd')
}

export const getTime = (dateTime: string) => {
  const time = new Date(dateTime)
  return format(time, 'hh:mm')
}
