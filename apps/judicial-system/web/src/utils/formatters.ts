import { isValid, format, parse, parseISO } from 'date-fns'
import { is } from 'date-fns/locale'

export const parseArray = (property: string, array: string[]) => {
  try {
    const json = JSON.parse(`{"${property}": [${array.map((a) => `"${a}"`)}]}`)
    return json
  } catch (e) {
    return null
  }
}

export const parseString = (property: string, value: string | Date) => {
  try {
    const json = JSON.parse(`{"${property}": "${value}"}`)
    return json
  } catch (e) {
    console.log(e)
    return null
  }
}

export const formatDate = (
  date: Date,
  formatPattern: string,
  options?: any,
) => {
  if (isValid(date)) {
    return format(date, formatPattern, options)
  } else if (isValid(parseISO(date.toString()))) {
    return format(parseISO(date.toString()), formatPattern, options)
  } else {
    return null
  }
}

// Credit: https://dzone.com/articles/capitalize-first-letter-string-javascript
export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const getTimeFromDate = (date: Date) => {
  if (date && isValid(date) && isValid(parseISO(date.toISOString()))) {
    return format(parseISO(date.toISOString()), 'HH:m')
  } else {
    return null
  }
}
