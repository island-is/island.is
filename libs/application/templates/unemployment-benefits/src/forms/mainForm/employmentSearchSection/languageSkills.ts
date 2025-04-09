import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const languageSkillsSubSection = buildSubSection({
  id: 'languageSkillsSubSection',
  title: employmentSearchMessages.languageSkills.sectionTitle,
  children: [
    buildMultiField({
      id: 'languageSkillsSubSection',
      title: employmentSearchMessages.languageSkills.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
