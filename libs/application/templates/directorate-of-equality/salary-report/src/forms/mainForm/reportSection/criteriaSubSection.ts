import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'

// Criteria are no longer persisted through applicationAnswers — this screen
// reads/writes the DMR draft directly (see CriteriaEditor), so the field
// carries no answer of its own to validate or default.
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
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
