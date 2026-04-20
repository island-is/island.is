import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusion } from '../lib/messages'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const Rejected: Form = buildForm({
  id: 'RejectedApplicationForm',
  title: '',
  logo: AoshLogo,
  mode: FormModes.REJECTED,
  children: [
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      alertTitle: conclusion.rejected.alertMessage,
      alertMessage: '',
      multiFieldTitle: conclusion.general.title,
      accordion: false,
      alertType: 'error',
    }),
  ],
})
