import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { confirmation } from '../../lib/messages'
import { informationSection } from './InformationSection'
import { paymentSection } from './paymentSection'
import { prerequisitesSection } from './prerequisitesSection'

export const DigitalTachographCompanyCardForm: Form = buildForm({
  id: 'DigitalTachographCompanyCardFormDraft',
  title: '',
  mode: FormModes.APPLYING,
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
