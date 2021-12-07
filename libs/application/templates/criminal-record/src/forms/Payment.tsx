import { m } from '../lib/messages'
import {
  buildForm,
  buildDescriptionField,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'

type CreateChargeData = {
  data: {
    paymentUrl: string
  }
}

export const Payment: Form = buildForm({
  id: 'DrivingLicenseApplicationPaymentForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: false,
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
        buildDescriptionField({
          id: 'infoAwaitingPayment',
          title: m.payment,
          condition: (_, externalData) => {
            return (
              !window.document.location.href.match(/\?done$/) &&
              (externalData.createCharge as CreateChargeData)?.data.paymentUrl
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
          component: 'PaymentUrlNotFoundField',
          id: 'infoPaymentUrlNotFound',
          title: m.payment,
          condition: (_, externalData) => {
            return (
              !window.document.location.href.match(/\?done$/) &&
              !(externalData.createCharge as CreateChargeData)?.data?.paymentUrl
            )
          },
        }),
        buildMultiField({
          id: 'overviewAwaitingPayment',
          title: m.confirmation,
          condition: () => {
            return !!window.document.location.href.match(/\?done$/)
          },
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
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [],
    }),
  ],
})
