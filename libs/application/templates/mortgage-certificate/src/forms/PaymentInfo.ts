import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItemCodesAndExtraLabel } from '../util'
import { confirmation, externalData, payment, property } from '../lib/messages'

export const PaymentInfo: Form = buildForm({
  id: 'PaymentInfo',
  title: '',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'selectProperty',
      title: property.general.sectionTitle,
      children: [],
    }),
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      forPaymentLabel: payment.labels.forPayment,
      getSelectedChargeItems: (application) =>
        getChargeItemCodesAndExtraLabel(application),
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
