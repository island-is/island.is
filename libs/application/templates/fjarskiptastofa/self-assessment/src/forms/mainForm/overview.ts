import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.overview.title,
      description: m.overview.description,
      children: [
        buildCustomField({
          id: 'assessmentOverview',
          component: 'AssessmentOverview',
        }),
        buildSubmitField({
          id: 'submit',
          title: m.overview.submit,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.overview.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
