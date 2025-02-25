import {
  buildCheckboxField,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  YES,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.yearlyOverview,
      description: m.review,
      children: [
        buildCustomField({
          id: 'overviewPartyField',
          doesNotRequireAnswer: true,
          component: 'PartyOverview',
        }),
        buildCheckboxField({
          id: 'approveOverview',
          options: [
            {
              label: m.overviewCorrect,
              value: YES,
            },
          ],
        }),
        buildSubmitField({
          id: 'overview.submit',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.send,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
