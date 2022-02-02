import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'
import { payment } from '../lib/messages'

export const GeneralFishingLicensePaymentForm: Form = buildForm({
  id: 'GeneralFishingLicensePaymentForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: false,
  children: [
    buildSection({
      id: 'awaitingPayment',
      title: payment.general.sectionTitle,
      children: [
        buildCustomField({
          component: 'PaymentPending',
          id: 'paymentPendingField',
          title: '',
        }),
      ],
    }),
  ],
})
