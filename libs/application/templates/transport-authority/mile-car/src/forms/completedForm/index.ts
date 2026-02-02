import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { confirmation as confirmationMessages } from '../../lib/messages'
import { FormModes } from '@island.is/application/types'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'
import { getConclusionAlertTitle } from '../../utils/conclusionAlertTitle'

export const completedForm = buildForm({
  id: 'completedForm',
  logo: TransportAuthorityLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      alertTitle: getConclusionAlertTitle,
      tabTitle: confirmationMessages.sectionTitle,
      expandableHeader: confirmationMessages.accordionTitle,
      expandableDescription: confirmationMessages.accordionText,
      expandableIntro: confirmationMessages.accordionIntro,
    }),
  ],
})
