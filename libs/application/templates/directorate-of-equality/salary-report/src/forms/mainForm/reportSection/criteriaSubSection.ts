import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'
import { DEFAULT_CRITERIA_ANSWERS } from '../../../utils/constants'

export const criteriaSubSection = buildSubSection({
  id: 'criteria',
  title: messages.report.criteria.sectionTitle,
  children: [
    buildMultiField({
      id: 'criteriaMultiField',
      title: messages.report.criteria.title,
      description: messages.report.criteria.intro,
      children: [
        buildCustomField({
          id: 'criteria',
          component: 'CriteriaEditor',
          doesNotRequireAnswer: false,
          defaultValue: DEFAULT_CRITERIA_ANSWERS,
        }),
      ],
    }),
  ],
})
