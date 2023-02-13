import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { formConclusionSection } from '@island.is/application/ui-forms'
import { confirmation } from '../lib/messages'

export const ComplaintsToAlthingiOmbudsmanSubmitted: Form = buildForm({
  id: 'ComplaintsToAlthingiOmbudsmanSubmitted',
  title: 'Kvörtun til umboðsmanns Alþingis',
  mode: FormModes.APPROVED,
  children: [
    formConclusionSection({
      alertTitle: confirmation.general.alertTitle,
      expandableHeader: confirmation.information.title,
      expandableIntro: confirmation.information.intro,
      expandableDescription: confirmation.information.bulletList,
    }),
  ],
})
