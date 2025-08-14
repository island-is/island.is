import { getValueViaPath } from '@island.is/application/core'
import { Application, Field } from '@island.is/application/types'
import { GaldurDomainModelsSelectItem } from '@island.is/clients/vmst-unemployment'
import { Locale } from '@island.is/shared/types'

export const getLanguageSkills = (
  application: Application,
  _field: Field,
  locale: Locale,
) => {
  const languageSkills = getValueViaPath<GaldurDomainModelsSelectItem[]>(
    application.externalData,
    'activityGrantApplication.data.activationGrant.supportData.languageValues',
  )
  return (
    languageSkills?.map((skill) => {
      return {
        label: (locale === 'is' ? skill.name : skill.english) || '',
        value: skill.id || '',
      }
    }) || []
  )
}

export const getLanguageSkillsRepeater = (
  application: Application,
  _field?: Record<string, string>,
  locale?: Locale,
) => {
  const languageSkills = getValueViaPath<GaldurDomainModelsSelectItem[]>(
    application.externalData,
    'activityGrantApplication.data.activationGrant.supportData.languageValues',
  )
  return (
    languageSkills?.map((skill) => {
      return {
        label: (locale === 'is' ? skill.name : skill.english) || '',
        value: skill.id || '',
      }
    }) || []
  )
}
