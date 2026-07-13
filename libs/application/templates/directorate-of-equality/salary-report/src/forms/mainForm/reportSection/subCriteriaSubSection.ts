import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'

export const subCriteriaSubSection = buildSubSection({
  id: 'subCriteria',
  title: messages.report.subCriteria.sectionTitle,
  children: [
    buildMultiField({
      id: 'subCriteriaMultiField',
      title: messages.report.subCriteria.title,
      description: messages.report.subCriteria.intro,
      children: [
        buildCustomField({
          id: 'subCriteria',
          component: 'SubCriteriaEditor',
          doesNotRequireAnswer: false,
        }),
      ],
    }),
  ],
})
