import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { confirmation } from '../lib/messages'

export const ComplaintsToAlthingiOmbudsmanSubmitted: Form = buildForm({
  id: 'ComplaintsToAlthingiOmbudsmanSubmitted',
  title: 'Kvörtun til umboðsmanns Alþingis',
  mode: FormModes.APPROVED,
  children: [
    buildSection({
      id: 'successfulSubmissionSection',
      title: confirmation.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'successfulSubmission',
          title: confirmation.general.sectionTitle,
          component: 'ConfirmationScreen',
        }),
      ],
    }),
  ],
})
