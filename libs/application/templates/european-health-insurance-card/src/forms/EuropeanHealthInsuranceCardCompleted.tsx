import { Form, FormModes } from '@island.is/application/types'
import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

export const EuropeanHealthInsuranceCardCompleted: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardApplicationForm',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'intro',
      title: e.introScreen.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'data',
      title: e.data.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'plastic',
      title: e.applicants.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'temp',
      title: e.temp.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'applicationReviewSection',
      title: e.review.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'completed',
      title: e.confirmation.sectionLabel,
      children: [
        buildMultiField({
          id: 'completedStep',
          title: e.confirmation.sectionTitle,
          children: [
            buildCustomField({
              id: 'completedScreen',
              component: 'CompletedScreen',
            }),
          ],
        }),
      ],
    }),
  ],
})

export default EuropeanHealthInsuranceCardCompleted
