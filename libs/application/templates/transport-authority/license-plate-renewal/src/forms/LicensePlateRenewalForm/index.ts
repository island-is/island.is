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
import { paymentSection } from './paymentSection'

export const LicensePlateRenewalForm: Form = buildForm({
  id: 'LicensePlateRenewalFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    prerequisitesSection,
    informationSection,
    paymentSection,
    buildSection({
      id: 'conclusion',
      title: conclusion.general.sectionTitle,
      children: [],
    }),
  ],
})
