import { GaldurDomainModelsEducationProgramDTO } from '@island.is/clients/vmst-unemployment'
import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'

export const getLevelsOfStudyOptions = (
  application: Application,
  locale: Locale,
) => {
  const education =
    getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
      application.externalData,
      'currentApplicationInformation.data.supportData.education',
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
      'currentApplicationInformation.data.supportData.education',
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
  locale: Locale,
) => {
  const education = getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
    application.externalData,
    'currentApplicationInformation.data.supportData.education',
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
      label:
        (locale === 'is' ? subject.name : subject.english ?? subject.name) ||
        '',
    })) ?? []
  )
}

export const getYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 51 }, (_, i) => {
    const year = (currentYear - i).toString()
    return { value: year, label: year }
  })
  return years
}
