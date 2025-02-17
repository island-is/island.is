import {
  buildSection,
  buildMultiField,
  buildSubmitField,
  buildPaymentChargeOverviewField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  StaticText,
} from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { paymentChargeOverview } from './messages'

type props = {
  getSelectedChargeItems: (application: Application) => {
    chargeItemCode: string
    chargeItemQuantity?: number
    extraLabel?: StaticText
  }[]
  sectionTitle?: MessageDescriptor
  forPaymentLabel?: MessageDescriptor
  totalLabel?: MessageDescriptor
}

/**
 * Creates a form payment charge overview section for applications
 * so the developer doesn't have to write the same code over and over again.
 *
 * @param  getSelectedChargeItems Function that returns all selected chargeItems
 * (chargeItem code and additional extraLabel if necessary)
 * @param  sectionTitle The text for the section title
 * @param  forPaymentLabel The text for the "For payment" sub title
 * @param  totalLabel The text for the "total" label for total sum of all charges
 */
export const buildFormPaymentChargeOverviewSection = (props: props) =>
  buildSection({
    id: 'uiForms.paymentChargeOverviewSection',
    title: props.sectionTitle
      ? props.sectionTitle
      : paymentChargeOverview.information.sectionTitle,
    children: [
      buildMultiField({
        id: 'uiForms.paymentChargeOverviewMultifield',
        title: paymentChargeOverview.information.formTitle,
        children: [
          buildPaymentChargeOverviewField({
            id: 'uiForms.paymentChargeOverviewMultifield',
            forPaymentLabel: props.forPaymentLabel
              ? props.forPaymentLabel
              : paymentChargeOverview.payment.forPayment,
            totalLabel: props.totalLabel
              ? props.totalLabel
              : paymentChargeOverview.payment.total,
            getSelectedChargeItems: props.getSelectedChargeItems,
          }),
          buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: paymentChargeOverview.information.continueButton,
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: paymentChargeOverview.information.continueButton,
                type: 'primary',
              },
            ],
          }),
        ],
      }),
    ],
  })
