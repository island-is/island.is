import { m } from '../lib/messages'
import {
  buildForm,
  buildDescriptionField,
  buildSection,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const payment: Form = buildForm({
  id: 'paymentForm',
  title: 'Greiðsla',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'awaitingPayment',
      title: 'Greiðsla',
      children: [
        // TODO: ekki tókst að stofna til greiðslu skjár - condition
        buildDescriptionField({
          id: 'info',
          title: 'Greiðsla',
          condition: () => {
            return !window.document.location.href.match(/\?done$/)
          },
          description: (application) => {
            const { paymentUrl } = application.externalData.createCharge
              .data as { paymentUrl: string }

            if (!paymentUrl) {
              throw new Error()
            }

            const returnURL = window.document.location.href
            const redirectUrl = `${paymentUrl}&returnURL=${encodeURIComponent(
              returnURL + '?done',
            )}`
            window.document.location.href = redirectUrl

            return m.forwardingToPayment
          },
        }),
        buildCustomField({
          condition: () => {
            return !!window.document.location.href.match(/\?done$/)
          },
          component: 'ExamplePaymentPendingField',
          id: 'paymentPendingField',
          title: '',
        }),
      ],
    }),
  ],
})
