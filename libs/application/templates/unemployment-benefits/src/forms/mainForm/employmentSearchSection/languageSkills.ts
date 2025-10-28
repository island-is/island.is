import {
  buildFieldsRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import { GaldurDomainModelsSelectItem } from '@island.is/clients/vmst-unemployment'
import { Locale } from '@island.is/shared/types'
import { LanguageIds } from '../../../shared'

export const languageSkillsSubSection = buildSubSection({
  id: 'languageSkillsSubSection',
  title: employmentSearchMessages.languageSkills.sectionTitle,
  children: [
    buildMultiField({
      id: 'languageSkillsSubSection',
      children: [
        buildFieldsRepeaterField({
          id: 'languageSkills',
          title: employmentSearchMessages.languageSkills.pageTitle,
          formTitleNumbering: 'none',
          minRows: 2,
          addItemButtonText:
            employmentSearchMessages.languageSkills.addItemButtonText,
          fields: {
            language: {
              label: employmentSearchMessages.languageSkills.language,
              component: 'select',
              width: 'half',
              options: (application, _, locale) => {
                const languages =
                  getValueViaPath<Array<GaldurDomainModelsSelectItem>>(
                    application.externalData,
                    'unemploymentApplication.data.supportData.languageKnowledge',
                  ) || []
                return languages
                  .filter(
                    (x) =>
                      x.id !== LanguageIds.ENGLISH &&
                      x.id !== LanguageIds.ICELANDIC,
                  )
                  .map((language) => ({
                    value: language.id || '',
                    label:
                      (locale === 'is' ? language.name : language.english) ||
                      '',
                  }))
              },
              readonly: (application, _, index) => {
                if (index !== undefined && index < 2) {
                  return true
                }
                return false
              },
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
                locale: Locale,
              ) => {
                const languages =
                  getValueViaPath<Array<GaldurDomainModelsSelectItem>>(
                    application.externalData,
                    'unemploymentApplication.data.supportData.languageKnowledge',
                  ) || []
                if (index === 0) {
                  return locale === 'is'
                    ? languages.find((x) => x.name === 'Íslenska')?.name
                    : languages.find((x) => x.name === 'Íslenska')?.english
                }
                if (index === 1) {
                  return locale === 'is'
                    ? languages.find((x) => x.name === 'Enska')?.name
                    : languages.find((x) => x.name === 'Enska')?.english
                }
                return ''
              },
            },

            skill: {
              label: employmentSearchMessages.languageSkills.skill,
              component: 'select',
              width: 'half',
              options: (application) => {
                const languageSkills =
                  getValueViaPath<Array<GaldurDomainModelsSelectItem>>(
                    application.externalData,
                    'unemploymentApplication.data.supportData.languageValues',
                  ) || []
                return languageSkills.map((skill) => ({
                  value: skill.id || '',
                  label: skill.name || '',
                }))
              },
            },
          },
        }),
      ],
    }),
  ],
})
