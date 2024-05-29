import {
  buildForm,
  buildMultiField,
  buildPaymentChargeOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { conclusion, payment } from '../../lib/messages'
import { informationSection } from './InformationSection'
import { prerequisitesSection } from './prerequisitesSection'
import { Logo } from '../../assets/Logo'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItemCodes } from '../../utils'
import { info } from 'kennitala'

export const LicensePlateRenewalForm: Form = buildForm({
  id: 'LicensePlateRenewalFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    prerequisitesSection,
    informationSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: (application) =>
        getChargeItemCodes(application).map((x) => ({
          chargeItemCode: x,
        })),
    }),
    buildSection({
      id: 'conclusion',
      title: conclusion.general.sectionTitle,
      children: [],
    }),
  ],
})
