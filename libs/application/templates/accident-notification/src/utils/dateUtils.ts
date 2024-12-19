import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

const getDateAYearBack = () => {
  const d = new Date()
  const aYearAgo = d.getFullYear() - 1
  d.setFullYear(aYearAgo)
  return d
}

export const isDateOlderThanAYear = (answers: FormValue) => {
  const aYearAgo = getDateAYearBack()
  const date = getValueViaPath<string>(
    answers,
    'accidentDetails.dateOfAccident',
  )
  return !!date && new Date(date).getTime() < aYearAgo.getTime()
}

export const isValid24HFormatTime = (value: string) => {
  if (value.length !== 4) return false
  const hours = parseInt(value.slice(0, 2))
  const minutes = parseInt(value.slice(2, 4))
  if (hours > 23) return false
  if (minutes > 59) return false
  return true
}
