import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'
import { conclusion } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  logo: TransportAuthorityLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      tabTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.pageTitle,
      alertTitle: conclusion.general.alertTitle,
      alertMessage: conclusion.general.alertMessage,
      expandableHeader: conclusion.general.accordionTitle,
      expandableIntro: '',
      expandableDescription: conclusion.general.accordionText,
    }),
  ],
})
