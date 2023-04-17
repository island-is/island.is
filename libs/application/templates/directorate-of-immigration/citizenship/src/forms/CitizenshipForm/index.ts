import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { confirmation, externalData } from '../../lib/messages'
import { InformationSection } from './InformationSection'
import { PaymentSection } from './PaymentSection'
import { Logo } from '../../assets/Logo'

export const CitizenshipForm: Form = buildForm({
  id: 'CitizenshipFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    InformationSection,
    PaymentSection,
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
