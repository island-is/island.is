import * as m from './messages'
import {
  buildForm,
  buildSection,
  buildPaymentPendingField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

// Factory so callers (e.g. buildPaymentState) can opt into surfacing a failed
// submit's structured errorReason as a toast. Defaults off — `PaymentForm`
// below keeps the original behaviour for existing importers.
export const getPaymentForm = (showSubmitErrorReason = false): Form =>
  buildForm({
    id: 'ExamplePaymentPaymentForm',
    mode: FormModes.DRAFT,
    renderLastScreenButton: false,
    children: [
      buildSection({
        id: 'info',
        title: m.messages.informationTitle,
        children: [],
      }),
      buildSection({
        id: 'awaitingPayment',
        title: m.messages.paymentConfirmation,
        children: [
          buildPaymentPendingField({
            id: 'paymentPending',
            title: m.messages.paymentConfirmation,
            showSubmitErrorReason,
          }),
        ],
      }),
      buildSection({
        id: 'confirm',
        title: m.messages.confirmTitle,
        children: [],
      }),
    ],
  })

export const PaymentForm: Form = getPaymentForm()
