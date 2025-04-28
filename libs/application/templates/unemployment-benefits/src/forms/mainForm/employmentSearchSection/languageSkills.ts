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
            const languages = getValueViaPath<{ name: string }[]>(
              application.externalData,
              'languages',
            ) ?? [
              {
                name: 'Íslenska',
              },
              {
                name: 'Enska',
              },
              {
                name: 'Danska',
              },
            ]
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
            // Maybe this is hardcoded?
            const languageSkills = getValueViaPath<{ name: string }[]>(
              application.externalData,
              'languageSkills',
            ) ?? [
              {
                name: 'Framúrskarandi',
              },
              {
                name: 'Mjög góð',
              },
            ]
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
