import { getValueViaPath, YES } from '@island.is/application/core'
import { EducationType } from '../shared'
import { Application, FormValue } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { GaldurDomainModelsEducationProgramDTO } from '@island.is/clients/vmst-unemployment'

export const wasStudyingLastTwelveMonths = (answers: FormValue) => {
  const lastTwelveMonths = getValueViaPath<string>(
    answers,
    'education.lastTwelveMonths',
  )
  return lastTwelveMonths === YES
}

export const isCurrentlyStudying = (answers: FormValue) => {
  const wasStudying = wasStudyingLastTwelveMonths(answers)
  const educationType =
    getValueViaPath<Array<string>>(answers, 'education.typeOfEducation') || []
  return wasStudying && educationType.includes(EducationType.CURRENT)
}

export const wasStudyingInTheLastYear = (answers: FormValue) => {
  const wasStudying = wasStudyingLastTwelveMonths(answers)
  const educationType =
    getValueViaPath<Array<string>>(answers, 'education.typeOfEducation') || []
  return wasStudying && educationType.includes(EducationType.LAST_YEAR)
}

export const wasStudyingLastSemester = (answers: FormValue) => {
  const wasStudying = wasStudyingLastTwelveMonths(answers)
  const educationType =
    getValueViaPath<Array<string>>(answers, 'education.typeOfEducation') || []
  return wasStudying && educationType.includes(EducationType.LAST_SEMESTER)
}

export const sameEducationAsCurrent = (answers: FormValue) => {
  const hasCheckedSame =
    getValueViaPath<Array<string>>(
      answers,
      'educationHistory.lastSemester.sameAsAboveEducation',
    ) || []

  return hasCheckedSame.includes(YES)
}

export const sameEducationAsLastSemester = (answers: FormValue) => {
  const hasCheckedSame =
    getValueViaPath<Array<string>>(
      answers,
      'educationHistory.finishedEducation.sameAsAboveEducation',
    ) || []

  return hasCheckedSame.includes(YES)
}

export const lastSemesterEducationFinsihed = (answers: FormValue) => {
  const lastSemesterEndDate = getValueViaPath<string>(
    answers,
    'educationHistory.lastSemester.endDate',
  )

  return !!lastSemesterEndDate
}

export const showFinishedEducationField = (answers: FormValue) => {
  if (sameEducationAsLastSemester(answers)) {
    return wasStudyingInTheLastYear(answers) && sameEducationAsCurrent(answers)
  } else {
    return wasStudyingInTheLastYear(answers)
  }
}

export const showFinishedEducationDateField = (answers: FormValue) => {
  if (showFinishedEducationField(answers)) {
    return showFinishedEducationField(answers)
  } else {
    return !lastSemesterEducationFinsihed(answers)
  }
}

export const appliedForNextSemester = (answers: FormValue) => {
  return getValueViaPath<string>(answers, 'education.appliedForNextSemester')
}

export const showAppliedForNextSemester = (answers: FormValue) => {
  return wasStudyingLastSemester(answers) || isCurrentlyStudying(answers)
}

export const getLevelsOfStudyOptions = (
  application: Application,
  locale: Locale,
) => {
  const education =
    getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
      application.externalData,
      'unemploymentApplication.data.supportData.educationPrograms',
    ) ?? []
  return (
    education.map((program) => ({
      value: program.id ?? '',
      label:
        (locale === 'is' ? program.name : program.english ?? program.name) ||
        '',
    })) ?? []
  )
}

export const getDegreeOptions = (
  application: Application,
  locale: Locale,
  levelOfStudy: string,
) => {
  const education =
    getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
      application.externalData,
      'unemploymentApplication.data.supportData.educationPrograms',
    ) ?? []

  const chosenLevelDegrees = education?.filter(
    (program) => program.id === levelOfStudy,
  )[0]?.degrees
  return (
    chosenLevelDegrees?.map((degree) => ({
      value: degree.id ?? '',
      label:
        (locale === 'is' ? degree.name : degree.english ?? degree.name) || '',
    })) ?? []
  )
}

export const getCourseOfStudy = (
  application: Application,
  levelOfStudy: string,
  degreeAnswer: string,
) => {
  const education = getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
    application.externalData,
    'unemploymentApplication.data.supportData.educationPrograms',
  )

  const chosenLevelDegrees = education?.filter(
    (program) => program.id === levelOfStudy,
  )[0]?.degrees

  const chosenDegreeSubjects = chosenLevelDegrees?.find(
    (degree) => degree.id === degreeAnswer,
  )?.subjects
  return (
    chosenDegreeSubjects?.map((subject) => ({
      value: subject.id ?? '',
      label: subject.name ?? '',
    })) ?? []
  )
}
