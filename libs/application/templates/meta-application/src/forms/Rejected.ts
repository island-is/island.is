import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const Rejected: Form = buildForm({
  id: ApplicationTypes.META_APPLICATION,
  name: m.rejected,
  mode: FormModes.REJECTED,
  children: [
    buildIntroductionField({
      id: 'rejected',
      name: m.rejectedName,
      introduction: m.rejectedIntroduction,
    }),
  ],
})
