import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusion } from '../lib/messages'
import { Logo } from '../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const Rejected: Form = buildForm({
  id: 'RejectedApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.REJECTED,
  children: [
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      alertTitle: conclusion.rejected.alertMessage,
      multiFieldTitle: conclusion.general.title,
      alertMessage: '',
      expandableDescription: '',
      expandableIntro: conclusion.rejected.message,
      alertType: 'error',
    }),
  ],
})
