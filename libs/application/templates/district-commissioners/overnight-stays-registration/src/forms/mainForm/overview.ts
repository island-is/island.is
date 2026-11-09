import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { applicationMessages as m } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewTitle,
  children: [
    buildMultiField({
      id: 'overviewFields',
      title: m.overviewTitle,
      description: m.overviewDescription,
      children: [
        buildCustomField({
          id: 'overnightStaysOverview',
          component: 'OvernightStaysOverview',
          doesNotRequireAnswer: true,
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.confirmButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
