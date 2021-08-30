import { FormValue } from '@island.is/application/core'
import { AccidentNotificationAnswers } from '..'

const getDateAYearBack = () => {
  const d = new Date()
  const aYearAgo = d.getFullYear() - 1
  d.setFullYear(aYearAgo)
  return d
}

export const isDateOlderThanAYear = (answers: FormValue) => {
  const aYearAgo = getDateAYearBack()
  const date = (answers as AccidentNotificationAnswers).accidentDetails
    ?.dateOfAccident
  return !!date && new Date(date).getTime() < aYearAgo.getTime()
}
