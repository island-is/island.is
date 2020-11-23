import { CaseTransition } from '@island.is/judicial-system/types'
import formatISO from 'date-fns/formatISO'
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import setSeconds from 'date-fns/setSeconds'

import { validate } from './validate'

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

export const parseTime = (date: string, time: string) => {
  const timeWithoutColon = time.replace(':', '')

  const dateHours = setHours(
    new Date(date),
    parseInt(timeWithoutColon.substr(0, 2)),
  )

  /**
   * We are not validating date because we are assuming the date can't be invalid.
   * The user can't input the date by hand and can't input the time before selecting
   * a date.
   * */
  if (
    validate(time, 'empty').isValid &&
    validate(time, 'time-format').isValid
  ) {
    const dateMinutes = formatISO(
      setSeconds(
        setMinutes(dateHours, parseInt(timeWithoutColon.substr(2, 4))),
        0,
      ),
    )

    return dateMinutes
  } else {
    return date.indexOf('T') > -1 ? date.substring(0, date.indexOf('T')) : date
  }
}

// Credit: https://stackoverflow.com/a/53060314
export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const replaceTabs = (str: string) =>
  str?.replace(/(?: \t+|\t+ |\t+)/g, ' ')

export const replaceTabsOnChange = (
  evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  evt.target.value = replaceTabs(evt.target.value)
}
