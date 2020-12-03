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
  name: m.pendingReviewthankYouScreenTitle,
  mode: FormModes.PENDING,
  children: [
    buildCustomField({
      id: 'pendingReviewThankYouScreen',
      name: m.pendingReviewthankYouScreenTitle,
      component: 'ThankYouScreen',
    }),
  ],
})
