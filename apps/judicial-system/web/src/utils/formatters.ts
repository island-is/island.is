import { CaseTransition } from '@island.is/judicial-system/types'
import { isValid, format, parseISO } from 'date-fns'
import { is } from 'date-fns/locale'

export const parseArray = (property: string, array: string[]) => {
  try {
    const json = JSON.parse(`{"${property}": [${array.map((a) => `"${a}"`)}]}`)
    return json
  } catch (e) {
    return null
  }
}

export const parseString = (
  property: string,
  value: string | Date | boolean,
) => {
  try {
    const json = JSON.parse(`{"${property}": ${JSON.stringify(value)}}`)
    return json
  } catch (e) {
    console.log(e)
    return null
  }
}

export const parseTransition = (
  modified: string,
  transition: CaseTransition,
) => {
  try {
    const json = JSON.parse(
      `{"modified": "${modified}", "transition": "${transition}"}`,
    )
    return json
  } catch (e) {
    console.log(e)
    return null
  }
}

export const formatDate = (date: string, formatPattern: string) => {
  if (isValid(parseISO(date))) {
    return format(parseISO(date), formatPattern, { locale: is })
  } else {
    return null
  }
}

// Credit: https://dzone.com/articles/capitalize-first-letter-string-javascript
export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
