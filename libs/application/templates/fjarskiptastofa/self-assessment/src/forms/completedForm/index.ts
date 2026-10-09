import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'resultsSection',
      title: m.results.sectionTitle,
      children: [
        buildMultiField({
          id: 'results',
          children: [
            buildCustomField({
              id: 'assessmentResults',
              component: 'AssessmentResults',
            }),
          ],
        }),
      ],
    }),
  ],
})
