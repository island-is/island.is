import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { YES } from '../../lib/constants'
import { m } from '../../lib/messages'

export const sectionReasonForApplication = buildSection({
  id: 'fakeData',
  title: m.reasonSectionTitle,
  children: [
    buildMultiField({
      id: 'reason',
      title: m.reasonTitle,
      description: m.reasonDescription,
      children: [
        buildCheckboxField({
          id: 'reason.confirmationCheckbox',
          title: '',
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.confirmReason,
            },
          ],
          required: true,
        }),
      ],
    }),
  ],
})
