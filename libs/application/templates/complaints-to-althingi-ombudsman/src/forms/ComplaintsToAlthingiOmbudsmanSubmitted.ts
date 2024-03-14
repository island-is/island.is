import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { application, confirmation } from '../lib/messages'

export const ComplaintsToAlthingiOmbudsmanSubmitted: Form = buildForm({
  id: 'ComplaintsToAlthingiOmbudsmanSubmitted',
  title: application.general.name,
  mode: FormModes.APPROVED,
  children: [
    buildFormConclusionSection({
      alertTitle: confirmation.general.alertTitle,
      expandableHeader: confirmation.information.title,
      expandableIntro: confirmation.information.intro,
      expandableDescription: confirmation.information.bulletList,
      sectionTitle: confirmation.general.title,
    }),
  ],
})
