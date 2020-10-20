import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  Form,
} from '@island.is/application/core'
import { m } from './messages'

export const Rejected: Form = buildForm({
  id: ApplicationTypes.APPLICATION_APPLICATION,
  ownerId: 'TODO?',
  name: m.rejected,
  mode: 'rejected',
  children: [
    buildIntroductionField({
      id: 'rejected',
      name: m.rejectedName,
      introduction: m.rejectedIntroduction,
    }),
  ],
})
