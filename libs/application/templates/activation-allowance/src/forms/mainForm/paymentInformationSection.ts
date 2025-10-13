import {
  buildBankAccountField,
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { paymentInformation } from '../../lib/messages'

export const paymentInformationSection = buildSection({
  id: 'paymentInformationSection',
  title: paymentInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'paymentInformationMultiField',
      title: paymentInformation.general.pageTitle,
      children: [
        buildBankAccountField({
          id: 'paymentInformation',
          title: paymentInformation.labels.accountInformation,
          titleVariant: 'h5',
          required: true,
        }),
        buildCustomField({
          id: 'paymentInformationValidation',
          component: 'PaymentInformationValidation',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
