import {
  ApplicationTypes,
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const PendingReview: Form = buildForm({
  id: ApplicationTypes.META_APPLICATION,
  title: m.pendingReview,
  mode: FormModes.PENDING,
  children: [
    buildDescriptionField({
      id: 'inReview',
      title: m.pendingReviewName,
      description: m.pendingReviewIntroduction,
    }),
  ],
})
