import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'
import { section, application, overview } from '../lib/messages'

export const ComplaintFormInReview: Form = buildForm({
  id: 'DataProtectionComplaintFormInReview',
  title: application.name,
  mode: FormModes.PENDING,
  children: [
    buildSection({
      id: 'inReview',
      title: section.received,
      children: [
        // TODO: This is a placeholder atm, unconfirmed what we'll be showing the user here
        buildCustomField({
          id: 'confirmationCustomField',
          title: overview.general.confirmationPageTitle,
          component: 'ComplaintConfirmation',
        }),
      ],
    }),
  ],
})
