import {
  ApplicationTypes,
  buildCustomField,
  buildForm,
  Form,
  FormModes,
} from '@island.is/application/core'

import { m } from './messages'

export const PendingReview: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  title: m.pendingReviewthankYouScreenTitle,
  mode: FormModes.PENDING,
  children: [
    buildCustomField({
      id: 'pendingReviewThankYouScreen',
      title: m.pendingReviewthankYouScreenTitle,
      component: 'ThankYouScreen',
    }),
  ],
})
