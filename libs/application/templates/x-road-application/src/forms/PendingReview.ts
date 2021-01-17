import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const PendingReview: Form = buildForm({
  id: ApplicationTypes.STRAUMURINN,
  name: m.pendingReview,
  mode: FormModes.PENDING,
  children: [
    buildIntroductionField({
      id: 'inReview',
      name: m.pendingReviewName,
      introduction: m.pendingReviewIntroduction,
    }),
  ],
})
