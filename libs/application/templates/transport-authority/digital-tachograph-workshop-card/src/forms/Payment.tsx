import {
  buildForm,
  buildDescriptionField,
  buildSection,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import {
  information,
  externalData,
  payment,
  confirmation,
} from '../lib/messages'

type CreateChargeData = {
  data: {
    paymentUrl: string
  }
}

export const Payment: Form = buildForm({
  id: 'PaymentForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'informationSection',
      title: information.general.sectionTitle,
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
          title: payment.general.sectionTitle,
          condition: (_, externalData) => {
            //TODOx remove, used to make testing payment easy
            const url = window.location.href
            const applicationId = url.substring(
              url.lastIndexOf('/') + 1,
              url.lastIndexOf('?'),
            )
            const { id: chargeId } = externalData.createCharge.data as {
              id: string
            }
            console.log(
              "curl -H 'Content-type: application/json' -X POST 'http://localhost:3333/application-payment/" +
                applicationId +
                '/' +
                chargeId +
                '\' -d \'{"status":"paid"}\'',
            )

            return !!window.document.location.href.match(/\?done$/)
          },
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
