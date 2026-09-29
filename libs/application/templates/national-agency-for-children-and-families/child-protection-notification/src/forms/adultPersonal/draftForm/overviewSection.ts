import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  YES,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

import { overviewMessages } from '../../../lib/messages'
import { adultPersonalOverviewFields } from '../../../utils/adultPersonalOverviewFields'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overviewMessages.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: overviewMessages.sectionTitle,
      description: overviewMessages.description,
      children: [
        ...adultPersonalOverviewFields(true),
        buildCheckboxField({
          id: 'overviewAccuracyConfirmation',
          required: true,
          options: [
            {
              value: YES,
              label: overviewMessages.accuracyConfirmation,
            },
          ],
        }),
        buildSubmitField({
          id: 'submit',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overviewMessages.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
