import {
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildTextField,
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
        buildTextField({
          id: 'languageSkills.icelandic', // TOOD Rename maybe
          readOnly: true,
          backgroundColor: 'white',
          title: languageSkills.labels.language,
          defaultValue: 'Íslenska',
          width: 'half',
        }),
        buildSelectField({
          id: 'languageSkills.icelandicAbility',
          title: languageSkills.labels.skills,
          options: [
            // TODO: get from API
            { value: 'basic', label: 'Grunnfærni' },
            { value: 'intermediate', label: 'Millistig' },
            { value: 'advanced', label: 'Framúrskarandi' },
          ],
          width: 'half',
        }),
        buildTextField({
          id: 'languageSkills.english', // TOOD Rename maybe
          readOnly: true,
          title: languageSkills.labels.language,
          backgroundColor: 'white',
          defaultValue: 'Enska',
          width: 'half',
        }),
        buildSelectField({
          id: 'languageSkills.englishAbility',
          title: languageSkills.labels.skills,
          options: [
            // TODO: get from API
            { value: 'basic', label: 'Grunnfærni' },
            { value: 'intermediate', label: 'Millistig' },
            { value: 'advanced', label: 'Framúrskarandi' },
          ],
          width: 'half',
        }),
        buildFieldsRepeaterField({
          id: 'languageSkills',
          titleVariant: 'h5',
          marginTop: 0,
          minRows: 0,
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
