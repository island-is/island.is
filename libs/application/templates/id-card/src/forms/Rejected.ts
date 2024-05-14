import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
// import { Logo } from '../../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { reviewConfirmation } from '../lib/messages'

// Change messages
export const Rejected: Form = buildForm({
  id: 'Rejected',
  title: '',
  // logo: Logo,
  mode: FormModes.REJECTED,
  children: [
    buildFormConclusionSection({
      sectionTitle: reviewConfirmation.general.sectionTitle,
      multiFieldTitle: reviewConfirmation.general.sectionTitle,
      alertTitle: reviewConfirmation.general.alertTitle,
      alertMessage: '',
      expandableHeader: reviewConfirmation.general.accordionTitle,
      expandableIntro: '',
      expandableDescription: reviewConfirmation.general.accordionText,
      bottomButtonMessage: reviewConfirmation.general.bottomButtonMessage,
    }),
  ],
})
