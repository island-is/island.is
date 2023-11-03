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
  sectionTitle?: MessageDescriptor
  getSelectedChargeItems: (
    application: Application,
  ) => { chargeItemCode: string; extraLabel?: StaticText }[]
}

/**
 * Creates a form payment charge overview section for applications
 * so the developer doesn't have to write the same code over and over again.
 *
 * @param  sectionTitle The title for the section
 * @param  getSelectedChargeItems Function that returns all selected chargeItems
 * (chargeItem code and additional extraLabel if necessary)
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
            title: '',
            forPaymentLabel: paymentChargeOverview.payment.forPayment,
            totalLabel: paymentChargeOverview.payment.total,
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
