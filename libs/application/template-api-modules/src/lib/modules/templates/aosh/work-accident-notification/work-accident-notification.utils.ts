import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const getDateAndTime = (
  date: string,
  hours: string,
  minutes: string,
): Date => {
  const finalDate = new Date(date)
  finalDate.setHours(
    parseInt(hours, 10), // hours
    parseInt(minutes, 10), // minutes
  )
  return finalDate
}

export const getValueList = (answers: FormValue, answer: string) => {
  const objectList = getValueViaPath(answers, answer, {}) as object

  return Object.values(objectList)
    .map((values: { label: string; value: string }[]) => {
      return values?.map(({ value }) => {
        return value
      })
    })
    .flat()
}
