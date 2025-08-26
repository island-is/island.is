import {
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { languageSkills } from '../../lib/messages'
import {
  getLanguageSkills,
  getLanguageSkillsRepeater,
} from '../../utils/getLanguageSkills'
import { getLanguagesForRepeater } from '../../utils/getLanguages'
import { Application, Field } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'

export const languageSkillsSection = buildSection({
  id: 'languageSkillsSection',
  title: languageSkills.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'languageSkillsMultiField',
      title: languageSkills.general.pageTitle,
      children: [
        buildTextField({
          id: 'languageSkills.icelandic',
          readOnly: true,
          backgroundColor: 'white',
          title: languageSkills.labels.language,
          defaultValue: (application: Application, _field: Field) => {
            const locale = getValueViaPath<Locale>(
              application.externalData,
              'startingLocale.data',
            )
            return locale === 'is' ? 'Íslenska' : 'Icelandic'
          },
          width: 'half',
        }),
        buildSelectField({
          id: 'languageSkills.icelandicAbility',
          title: languageSkills.labels.skills,
          required: true,
          options: getLanguageSkills,
          width: 'half',
        }),
        buildTextField({
          id: 'languageSkills.english',
          readOnly: true,
          title: languageSkills.labels.language,
          backgroundColor: 'white',
          defaultValue: (application: Application, _field: Field) => {
            const locale = getValueViaPath<Locale>(
              application.externalData,
              'startingLocale.data',
            )
            return locale === 'is' ? 'Enska' : 'English'
          },
          width: 'half',
        }),
        buildSelectField({
          id: 'languageSkills.englishAbility',
          title: languageSkills.labels.skills,
          options: getLanguageSkills,
          required: true,
          width: 'half',
        }),
        buildFieldsRepeaterField({
          id: 'languageSkills.other',
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
              required: true,
              options: getLanguagesForRepeater,
            },
            skills: {
              component: 'select',
              label: languageSkills.labels.skills,
              width: 'half',
              required: true,
              options: getLanguageSkillsRepeater,
            },
          },
        }),
      ],
    }),
  ],
})
