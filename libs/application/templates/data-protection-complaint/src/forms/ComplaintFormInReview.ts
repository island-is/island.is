import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
} from '@island.is/application/core'

import { application, overview,section } from '../lib/messages'

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
