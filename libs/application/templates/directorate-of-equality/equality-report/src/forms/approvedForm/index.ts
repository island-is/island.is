import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { messages } from '../../lib/messages'

export const approvedForm = buildForm({
  id: 'approvedForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.APPROVED,
  children: [
    buildFormConclusionSection({
      sectionTitle: messages.approved.sectionTitle,
      tabTitle: messages.approved.sectionTitle,
      alertTitle: messages.approved.title,
      alertMessage: messages.approved.description,
    }),
  ],
})
