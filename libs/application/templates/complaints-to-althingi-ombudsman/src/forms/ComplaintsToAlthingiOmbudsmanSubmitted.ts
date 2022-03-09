import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
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
