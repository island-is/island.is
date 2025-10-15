import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { EducationType } from '../shared'
import { FormValue } from '@island.is/application/types'

export const wasStudyingLastTwelveMonths = (answers: FormValue) => {
  const lastTwelveMonths = getValueViaPath<string>(
    answers,
    'education.lastTwelveMonths',
  )
  return lastTwelveMonths === YES
}

export const isCurrentlyStudying = (answers: FormValue) => {
  const wasStudying = wasStudyingLastTwelveMonths(answers)
  const educationType = getValueViaPath<string>(
    answers,
    'education.typeOfEducation',
  )
  return wasStudying && educationType === EducationType.CURRENT
}

export const wasStudyingInTheLastYear = (answers: FormValue) => {
  const wasStudying = wasStudyingLastTwelveMonths(answers)
  const educationType = getValueViaPath<string>(
    answers,
    'education.typeOfEducation',
  )
  return wasStudying && educationType === EducationType.LAST_YEAR
}

export const wasStudyingLastSemester = (answers: FormValue) => {
  const wasStudying = wasStudyingLastTwelveMonths(answers)
  const educationType = getValueViaPath<string>(
    answers,
    'education.typeOfEducation',
  )
  return wasStudying && educationType === EducationType.LAST_SEMESTER
}

export const hasCurrentOrRecentEducation = (answers: FormValue) => {
  const lastTwelve = wasStudyingLastTwelveMonths(answers)
  const educationType = getValueViaPath<string>(
    answers,
    'education.typeOfEducation',
  )

  const lastSemester = didYouFinishLastSemester(answers)
  const appliedForNext = appliedForNextSemester(answers)

  return (
    lastTwelve &&
    (educationType === EducationType.CURRENT ||
      (educationType === EducationType.LAST_SEMESTER &&
        (lastSemester === YES ||
          (lastSemester === NO && appliedForNext === YES))) ||
      educationType === EducationType.LAST_YEAR)
  )
}

export const didYouFinishLastSemester = (answers: FormValue) => {
  return getValueViaPath<string>(answers, 'education.didFinishLastSemester')
}

export const appliedForNextSemester = (answers: FormValue) => {
  return getValueViaPath<string>(answers, 'education.appliedForNextSemester')
}

export const showAppliedForNextSemester = (answers: FormValue) => {
  return (
    wasStudyingLastTwelveMonths(answers) &&
    wasStudyingLastSemester(answers) &&
    didYouFinishLastSemester(answers) === NO
  )
}

export const showCurrentEducationFields = (answers: FormValue) => {
  return (
    wasStudyingLastTwelveMonths(answers) &&
    (isCurrentlyStudying(answers) ||
      wasStudyingInTheLastYear(answers) ||
      (wasStudyingLastSemester(answers) &&
        appliedForNextSemester(answers) !== NO))
  )
}
