import {
  buildForm,
  buildDescriptionField,
  buildSection,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { conclusion, payment, externalData } from '../lib/messages'
import { Logo } from '../assets/Logo'

type CreateChargeData = {
  data: {
    paymentUrl: string
  }
}

export const Payment: Form = buildForm({
  id: 'PaymentForm',
  title: '',
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [
        // Payment is not finished and paymentUrl does not exist -> Error: Payment url not found
        buildMultiField({
          id: 'subSectionPaymentUrlNotFound',
          title: payment.general.sectionTitle,
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
              component: 'PaymentUrlNotFound',
              disabled: true,
              title: payment.general.sectionTitle,
            }),
            buildSubmitField({
              id: 'goBack',
              placement: 'footer',
              title: payment.general.tryAgain,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.ABORT,
                  name: payment.general.tryAgain,
                  type: 'subtle',
                },
              ],
            }),
          ],
        }),
        // Payment is not finished and paymentUrl does exist -> Redirect user to payment url
        buildDescriptionField({
          id: 'subSectionRedirectPayment',
          title: payment.general.sectionTitle,
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

            return payment.general.forwardingToPayment
          },
        }),
        // Payment is finished -> Show payment pending page that submits application
        buildCustomField({
          id: 'subSectionPaymentPending',
          component: 'PaymentPending',
          title: conclusion.general.title,
          condition: () => {
            return !!window.document.location.href.match(/\?done$/)
          },
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: conclusion.general.sectionTitle,
      children: [],
    }),
  ],
})
