import { Application } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import {
  getLanguageOptions,
  getLanguageAbilityOptions,
} from './selectOptions'
import {
  getLevelsOfStudyOptions,
  getDegreeOptions,
  getCourseOfStudy,
  findDegreeLabel,
  findCourseLabel,
} from './educationInformation'
import {
  getDefaultDrivingLicenses,
  getDefaultEducation,
  getDefaultLanguages,
  getDefaultEures,
} from './defaultValues'

export const getEducationStaticTableData = (application: Application) => {
  const defaults = getDefaultEducation(application.externalData)
  const levels = getLevelsOfStudyOptions(application, 'is' as Locale)
  return defaults.map((edu) => ({
    levelOfStudy:
      levels.find((o) => o.value === edu.levelOfStudy)?.label ??
      edu.levelOfStudy,
    degree:
      getDegreeOptions(application, 'is' as Locale, edu.levelOfStudy).find(
        (o) => o.value === edu.degree,
      )?.label ?? edu.degree,
    courseOfStudy:
      getCourseOfStudy(
        application,
        edu.levelOfStudy,
        edu.degree,
        'is' as Locale,
      ).find((o) => o.value === edu.courseOfStudy)?.label ?? edu.courseOfStudy,
    endDate: edu.endDate,
  }))
}

export const formatLevelOfStudy = (
  value: string,
  _displayIndex: number,
  application?: Application,
) => {
  if (!application) return value
  const opts = getLevelsOfStudyOptions(application, 'is' as Locale)
  return opts.find((o) => o.value === value)?.label ?? value
}

export const getDefaultHasDrivingLicense = (application: Application) => {
  const defaults = getDefaultDrivingLicenses(application.externalData)
  return defaults.length > 0 ? ['yes'] : []
}

export const getLanguageStaticTableData = (application: Application) => {
  const defaults = getDefaultLanguages(application.externalData)
  const langs = getLanguageOptions(application.externalData, 'is' as Locale)
  const abilities = getLanguageAbilityOptions(
    application.externalData,
    'is' as Locale,
  )
  return defaults.map((lang) => ({
    language:
      langs.find((o) => o.value === lang.language)?.label ?? lang.language,
    skill:
      abilities.find((o) => o.value === lang.skill)?.label ?? lang.skill,
  }))
}

export const formatLanguage = (
  value: string,
  _displayIndex: number,
  application?: Application,
) => {
  if (!application) return value
  const opts = getLanguageOptions(application.externalData, 'is' as Locale)
  return opts.find((o) => o.value === value)?.label ?? value
}

export const formatLanguageSkill = (
  value: string,
  _displayIndex: number,
  application?: Application,
) => {
  if (!application) return value
  const opts = getLanguageAbilityOptions(
    application.externalData,
    'is' as Locale,
  )
  return opts.find((o) => o.value === value)?.label ?? value
}

export const formatDegree = (
  value: string,
  _displayIndex: number,
  application?: Application,
) => {
  if (!application) return value
  return findDegreeLabel(application, value)
}

export const formatCourseOfStudy = (
  value: string,
  _displayIndex: number,
  application?: Application,
) => {
  if (!application) return value
  return findCourseLabel(application, value)
}

export const getDefaultDrivingLicenseTypes = (application: Application) =>
  getDefaultDrivingLicenses(application.externalData)

export const getDefaultEuresValue = (application: Application) =>
  getDefaultEures(application.externalData)
