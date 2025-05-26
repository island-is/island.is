import {
  buildFieldsRepeaterField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const languageSkillsSubSection = buildSubSection({
  id: 'languageSkillsSubSection',
  title: employmentSearchMessages.languageSkills.sectionTitle,
  children: [
    buildFieldsRepeaterField({
      id: 'languageSkills',
      title: employmentSearchMessages.languageSkills.pageTitle,
      formTitleNumbering: 'none',
      minRows: 1,
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
