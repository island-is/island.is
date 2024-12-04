import {
  buildCheckboxField,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { overview } from '../../../lib/messages'
import { DefaultEvents, NO, YES } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: overview.general.pageTitle,
      description: overview.general.description,
      children: [
        buildCustomField({
          component: 'Overview',
          id: 'overview',
          title: '',
          description: '',
        }),
        buildCheckboxField({
          id: 'approveTermsAndConditions',
          title: '',
          options: [
            { value: YES, label: overview.confirmation.checkboxMessage },
          ],
          defaultValue: [NO],
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: overview.confirmation.confirm,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.confirmation.confirm,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
