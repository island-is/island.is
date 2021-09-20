import { m } from '../lib/messages'
import {
  buildForm,
  buildDescriptionField,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
  buildSubmitField,
  DefaultEvents,
  buildMultiField,
} from '@island.is/application/core'

export const payment: Form = buildForm({
  id: 'DrivingLicenseApplicationPaymentForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: false,
  children: [
    buildSection({
      id: 'awaitingPayment',
      title: m.paymentCapital,
      children: [
        // TODO: ekki tókst að stofna til greiðslu skjár - condition
        buildDescriptionField({
          id: 'infoAwaitingPayment',
          title: m.paymentCapital,
          condition: () => {
            return !window.document.location.href.match(/\?done$/)
          },
          description: (application) => {
            const { paymentUrl } = application.externalData.createCharge
              .data as { paymentUrl: string }

            if (!paymentUrl) {
              throw new Error()
            }

            const returnUrl = window.document.location.href
            const redirectUrl = `${paymentUrl}&returnURL=${encodeURIComponent(
              returnUrl + '?done',
            )}`
            window.document.location.href = redirectUrl

            return m.forwardingToPayment
          },
        }),
        buildMultiField({
          condition: () => {
            return !!window.document.location.href.match(/\?done$/)
          },
          id: 'overviewAwaitingPayment',
          title: '',
          space: 1,
          description: '',
          children: [
            buildCustomField({
              component: 'ExamplePaymentPendingField',
              id: 'paymentPendingField',
              title: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
