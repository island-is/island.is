import { buildCustomField, buildForm } from '@island.is/application/core'
import { ApplicationTypes, Form, FormModes } from '@island.is/application/types'

import { m } from './messages'

export const PendingReview: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  title: m.pendingReviewthankYouScreenTitle,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildCustomField({
      id: 'pendingReviewThankYouScreen',
      title: m.pendingReviewthankYouScreenTitle,
      component: 'ThankYouScreen',
    }),
  ],
})
