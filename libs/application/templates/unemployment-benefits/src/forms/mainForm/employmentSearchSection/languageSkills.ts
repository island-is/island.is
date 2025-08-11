import {
  buildFieldsRepeaterField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'
import { Application } from '@island.is/application/types'

export const languageSkillsSubSection = buildSubSection({
  id: 'languageSkillsSubSection',
  title: employmentSearchMessages.languageSkills.sectionTitle,
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
          options: (application) => {
            const languages =
              getValueViaPath<{ name: string }[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.languageKnowledge',
              ) || []
            return languages.map((language) => ({
              value: language.name,
              label: language.name,
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
          ) => {
            const languages =
              getValueViaPath<{ name: string }[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.languageKnowledge',
              ) || []
            if (index === 0) {
              return languages.find((x) => x.name === 'Íslenska')?.name
            }
            if (index === 1) {
              return languages.find((x) => x.name === 'Enska')?.name
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
              getValueViaPath<{ name: string }[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.languageValues',
              ) || []
            return languageSkills.map((skill) => ({
              value: skill.name,
              label: skill.name,
            }))
          },
        },
      },
    }),
  ],
})
