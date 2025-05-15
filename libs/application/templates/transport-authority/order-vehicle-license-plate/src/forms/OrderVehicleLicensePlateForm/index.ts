import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { confirmation } from '../../lib/messages'
import { informationSection } from './InformationSection'
import { prerequisitesSection } from './prerequisitesSection'
import { paymentSection } from './paymentSection'
import { Logo } from '../../assets/Logo'

export const OrderVehicleLicensePlateForm: Form = buildForm({
  id: 'OrderVehicleLicensePlateFormDraft',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    prerequisitesSection,
    informationSection,
    paymentSection,
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
