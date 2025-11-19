import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { GaldurDomainModelsSelectItem } from '@island.is/clients/vmst-unemployment'
import { Locale } from '@island.is/shared/types'

export const getLanguagesForRepeater = (
  application: Application,
  _field?: Record<string, string>,
  locale?: Locale,
) => {
  const languageSkills = getValueViaPath<GaldurDomainModelsSelectItem[]>(
    application.externalData,
    'activityGrantApplication.data.activationGrant.supportData.languageKnowledge',
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
