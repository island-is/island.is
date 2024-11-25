import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusion } from '../../lib/messages'
import { informationSection } from './InformationSection'
import { prerequisitesSection } from './prerequisitesSection'
import { Logo } from '../../assets/Logo'
import { paymentSection } from './paymentSection'

export const LicensePlateRenewalForm: Form = buildForm({
  id: 'LicensePlateRenewalFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
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
