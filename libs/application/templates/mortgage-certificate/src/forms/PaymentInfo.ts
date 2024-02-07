import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItemCodesAndExtraLabel } from '../util'

export const PaymentInfo: Form = buildForm({
  id: 'PaymentInfo',
  title: '',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'selectRealEstate',
      title: m.property,
      children: [],
    }),
    buildFormPaymentChargeOverviewSection({
      sectionTitle: m.payment,
      forPaymentLabel: m.overviewPaymentCharge,
      getSelectedChargeItems: (application) =>
        getChargeItemCodesAndExtraLabel(application),
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [],
    }),
  ],
})
