import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

// The assessment step: a single screen whose categories and questions come
// entirely from Fjarskiptastofa's API. New categories or questions appear here
// automatically, with no code changes.
export const assessmentSection = buildSection({
  id: 'assessmentSection',
  title: m.assessment.sectionTitle,
  children: [
    buildMultiField({
      id: 'assessment',
      children: [
        buildCustomField({
          id: 'assessment',
          component: 'AssessmentQuestions',
        }),
      ],
    }),
  ],
})
