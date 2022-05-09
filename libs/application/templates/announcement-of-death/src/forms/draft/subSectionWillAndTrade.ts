import {
  buildMultiField,
  buildKeyValueField,
  buildSubSection,
  buildRadioField,
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
      space: 1,
      children: [
        buildKeyValueField({
          label: m.testamentTestamentAvailable,
          value: ({ answers }) =>
            answers.districtCommissionerHasWill
              ? m.testamentKnowledgeOfOtherTestamentYes
              : m.testamentKnowledgeOfOtherTestamentNo,
          width: 'half',
        }),
        buildKeyValueField({
          label: m.testamentBuyration,
          value: ({ answers }) =>
            answers.marriageSettlement
              ? m.testamentKnowledgeOfOtherTestamentYes
              : m.testamentKnowledgeOfOtherTestamentNo,
          width: 'half',
        }),
        buildRadioField({
          id: 'knowledgeOfOtherWills',
          title: m.testamentKnowledgeOfOtherTestament,
          width: 'full',
          largeButtons: false,
          space: 3,
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
      ],
    }),
  ],
})
