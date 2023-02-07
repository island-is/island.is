import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { confirmation } from '../../lib/messages'
import { cardTypeSection } from './CardTypeSection'
import { applicantSection } from './ApplicantSection'
import { paymentSection } from './paymentSection'
import { prerequisitesSection } from './prerequisitesSection'
import { Logo } from '../../assets/Logo'

export const DigitalTachographDriversCardForm: Form = buildForm({
  id: 'DigitalTachographDriversCardFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    prerequisitesSection,
    cardTypeSection,
    applicantSection,
    paymentSection,
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
