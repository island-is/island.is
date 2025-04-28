import { getValueViaPath } from '@island.is/application/core'
import { EducationType } from '../shared'
import { FormValue } from '@island.is/application/types'

export const isCurrentlyStudying = (answers: FormValue) => {
  const educationType = getValueViaPath<string>(
    answers,
    'educationInformation.educationType',
  )
  return educationType === EducationType.CURRENT
}

export const wasStudyingInTheLastYear = (answers: FormValue) => {
  const educationType = getValueViaPath<string>(
    answers,
    'educationInformation.educationType',
  )
  return educationType === EducationType.LAST_YEAR
}

export const wasStudyingLastSemester = (answers: FormValue) => {
  const educationType = getValueViaPath<string>(
    answers,
    'educationInformation.educationType',
  )
  return educationType === EducationType.LAST_SEMESTER
}
