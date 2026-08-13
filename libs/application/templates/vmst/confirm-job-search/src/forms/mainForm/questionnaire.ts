import { buildMultiField, buildSection } from '@island.is/application/core'
import { questionnaire } from '../../lib/messages'

export const questionnaireSection = buildSection({
  id: 'questionnaireSection',
  title: questionnaire.sectionStepTitle,
  children: [
    buildMultiField({
      id: 'questionnaireMultiField',
      title: questionnaire.sectionTitle,
      description: questionnaire.multiFieldDescription,
      children: [],
    }),
  ],
})
