import {
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { languageSkills } from '../../lib/messages'

export const languageSkillsSection = buildSection({
  id: 'languageSkillsSection',
  title: languageSkills.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'languageSkillsMultiField',
      title: languageSkills.general.pageTitle,
      children: [
        buildFieldsRepeaterField({
          id: 'languageSkills',
          titleVariant: 'h5',
          marginTop: 0,
          minRows: 2,
          formTitleNumbering: 'none',
          addItemButtonText: languageSkills.labels.addLanguageButton,
          fields: {
            language: {
              component: 'select',
              width: 'half',
              label: languageSkills.labels.language,
              options: [
                // TODO: get from API
                { value: 'english', label: 'Enska' },
                { value: 'icelandic', label: 'Íslenska' },
                { value: 'swedish', label: 'Sænska' },
                { value: 'norwegian', label: 'Norska' },
              ],
            },
            skills: {
              component: 'select',
              label: languageSkills.labels.skills,
              width: 'half',
              options: [
                // TODO: get from API
                { value: 'basic', label: 'Grunnfærni' },
                { value: 'intermediate', label: 'Millistig' },
                { value: 'advanced', label: 'Framúrskarandi' },
              ],
            },
          },
        }),
      ],
    }),
  ],
})
