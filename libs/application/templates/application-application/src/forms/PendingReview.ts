import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  Form,
} from '@island.is/application/core'
import { m } from './messages'

export const PendingReview: Form = buildForm({
  id: ApplicationTypes.APPLICATION_APPLICATION,
  ownerId: 'TODO?',
  name: m.pendingReview,
  mode: 'pending',
  children: [
    buildIntroductionField({
      id: 'inReview',
      name: m.pendingReviewName,
      introduction: m.pendingReviewIntroduction,
    }),
  ],
})
