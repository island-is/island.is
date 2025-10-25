import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
  YES,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const sectionReasonForApplication = buildSection({
  id: 'reason',
  title: m.reasonSectionTitle,
  children: [
    buildMultiField({
      id: 'reason',
      title: m.reasonTitle,
      description: m.reasonDescription,
      children: [
        buildCheckboxField({
          id: 'reasonCheckbox',
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
