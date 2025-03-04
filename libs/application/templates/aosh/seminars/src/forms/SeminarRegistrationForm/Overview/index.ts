import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { overview } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import { PaymentOptions } from '../../../shared/contstants'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection.multiField',
      title: overview.general.pageTitle,
      children: [
        buildCustomField({
          id: 'overview',
          title: '',
          component: 'Overview',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          condition: (answers) => {
            const paymentOptions = getValueViaPath<PaymentOptions>(
              answers,
              'paymentArrangement.paymentOptions',
            )
            return paymentOptions === PaymentOptions.putIntoAccount
          },
          title: overview.general.approveButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.general.approveButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
