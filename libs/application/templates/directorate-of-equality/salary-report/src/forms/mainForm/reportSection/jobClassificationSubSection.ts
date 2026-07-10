import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'

export const jobClassificationSubSection = buildSubSection({
  id: 'jobClassification',
  title: messages.report.jobClassification.sectionTitle,
  children: [
    buildMultiField({
      id: 'jobClassificationMultiField',
      title: messages.report.jobClassification.title,
      description: messages.report.jobClassification.intro,
      children: [
        buildCustomField({
          id: 'roles',
          component: 'JobClassificationEditor',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
