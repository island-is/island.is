import { m } from '../lib/messages'
import {
  buildForm,
  buildDescriptionField,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'

export const payment: Form = buildForm({
  id: 'DrivingLicenseApplicationPaymentForm',
  title: m.payment,
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'awaitingPayment',
      title: m.paymentCapital,
      children: [
        // TODO: ekki tókst að stofna til greiðslu skjár - condition
        buildDescriptionField({
          id: 'info',
          title: m.paymentCapital,
          description: (application) => {
            const { paymentUrl } = application.externalData.createCharge.data as { paymentUrl: string }

            if (!paymentUrl) {
              console.log(application.externalData.createCharge)
              throw new Error()
            }

            const returnUrl = window.document.location.href
            const redirectUrl = `${paymentUrl}&returnUrl=${encodeURIComponent(
              returnUrl,
            )}`
            window.document.location.href = redirectUrl

            return m.forwardingToPayment
          },
        }),
      ],
    }),
  ],
})
