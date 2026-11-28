import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  YES,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { overviewMessages } from '../../lib/messages'
import { overviewFields } from '../../utils/overviewFields'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overviewMessages.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: overviewMessages.sectionTitle,
      description: overviewMessages.description,
      children: [
        ...overviewFields(true),
        buildCheckboxField({
          id: 'confirmCorrectInfo',
          marginTop: 3,
          required: true,
          options: [
            {
              value: YES,
              label: overviewMessages.confirmCorrectInfo,
            },
          ],
        }),
        buildSubmitField({
          id: 'submit',
          title: overviewMessages.submitButton,
          refetchApplicationAfterSubmit: true,
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
