import { CaseTransition } from '@island.is/judicial-system/types'
import { formatISO, setHours, setMinutes } from 'date-fns'

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

  const dateMinutes = formatISO(
    setMinutes(dateHours, parseInt(timeWithoutColon.substr(2, 4))),
  )

  return dateMinutes
}
