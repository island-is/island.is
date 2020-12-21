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
  name: m.pendingReview,
  mode: FormModes.PENDING,
  children: [
    buildDescriptionField({
      id: 'inReview',
      name: m.pendingReviewName,
      description: m.pendingReviewIntroduction,
    }),
  ],
})
