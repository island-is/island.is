import {
  buildMultiField,
  buildSubSection,
  buildRadioField,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const subSectionWillAndTrade = buildSubSection({
  id: 'testament',
  title: m.testamentTitle,
  children: [
    buildMultiField({
      id: 'inheritanceTitle',
      title: m.testamentTitle,
      description: m.testamentDescription,
      children: [
        buildRadioField({
          id: 'knowledgeOfOtherWills',
          title: m.testamentKnowledgeOfOtherTestament,
          width: 'full',
          marginBottom: 'gutter',
          largeButtons: true,
          defaultValue: '',
          options: [
            {
              value: 'yes',
              label: m.testamentKnowledgeOfOtherTestamentYes,
            },
            {
              value: 'no',
              label: m.testamentKnowledgeOfOtherTestamentNo,
            },
          ],
        }),
        buildCustomField({
          id: 'knowledgeOfOtherWills.validation',
          component: 'RadioValidation',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
