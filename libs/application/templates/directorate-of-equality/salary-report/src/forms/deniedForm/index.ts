import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { messages } from '../../lib/messages'

export const deniedForm = buildForm({
  id: 'deniedForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.REJECTED,
  children: [
    buildFormConclusionSection({
      sectionTitle: messages.rejected.sectionTitle,
      tabTitle: messages.rejected.sectionTitle,
      alertTitle: messages.rejected.title,
      alertMessage: messages.rejected.description,
    }),
  ],
})
