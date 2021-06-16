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
            const createCharge = application.externalData.createCharge.data as {
              error: ''
              data: { paymentUrl: string }
            }
            if (!createCharge.error) console.log({ createCharge })
            const paymentUrl = createCharge.data.paymentUrl
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
