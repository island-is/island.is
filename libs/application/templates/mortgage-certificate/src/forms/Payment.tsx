import { m } from '../lib/messages'
import {
  buildForm,
  buildDescriptionField,
  buildSection,
  DefaultEvents,
  Form,
  FormModes,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'

type CreateChargeData = {
  data: {
    paymentUrl: string
  }
}

export const Payment: Form = buildForm({
  id: 'MortgageCertificateApplicationPaymentForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'awaitingPayment',
      title: m.payment,
      children: [
        buildMultiField({
          id: 'infoPaymentUrlNotFound',
          title: m.payment,
          condition: (_, externalData) => {
            return (
              !window.document.location.href.match(/\?done$/) &&
              !(externalData.createCharge as CreateChargeData).data.paymentUrl
            )
          },
          space: 1,
          description: '',
          children: [
            buildCustomField({
              id: 'paymentUrlNotFound',
              component: 'PaymentUrlNotFoundField',
              disabled: true,
              title: m.payment,
            }),
            buildSubmitField({
              id: 'goBack',
              placement: 'footer',
              title: m.tryAgain,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.tryAgain,
                  type: 'subtle',
                },
              ],
            }),
          ],
        }),

        buildDescriptionField({
          id: 'infoAwaitingPayment',
          title: m.payment,
          condition: (_, externalData) => {
            return (
              !window.document.location.href.match(/\?done$/) &&
              (externalData.createCharge as CreateChargeData).data.paymentUrl
                .length > 0
            )
          },
          description: (application) => {
            const { paymentUrl } = application.externalData.createCharge
              .data as { paymentUrl: string }

            const returnUrl = window.document.location.href
            const redirectUrl = `${paymentUrl}&returnURL=${encodeURIComponent(
              returnUrl + '?done',
            )}`
            window.document.location.href = redirectUrl

            return m.forwardingToPayment
          },
        }),
        buildCustomField({
          id: 'paymentPending',
          component: 'PaymentPending',
          title: m.confirmation,
          condition: () => {
            return !!window.document.location.href.match(/\?done$/)
          },
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [],
    }),
  ],
})
