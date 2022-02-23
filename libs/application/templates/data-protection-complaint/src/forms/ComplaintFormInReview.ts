import {
  buildForm,
  buildSection,
  Form,
  buildCustomField,
} from '@island.is/application/core'
import { section, application, overview } from '../lib/messages'

export const ComplaintFormInReview: Form = buildForm({
  id: 'DataProtectionComplaintFormInReview',
  title: application.name,
  children: [
    buildSection({
      id: 'inReview',
      title: section.received,
      children: [
        buildCustomField({
          id: 'confirmationCustomField',
          title: overview.general.confirmationPageTitle,
          component: 'ComplaintConfirmation',
        }),
      ],
    }),
  ],
})
