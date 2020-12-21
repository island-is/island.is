import {
  ApplicationTypes,
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const Rejected: Form = buildForm({
  id: ApplicationTypes.META_APPLICATION,
  title: m.rejected,
  mode: FormModes.REJECTED,
  children: [
    buildDescriptionField({
      id: 'rejected',
      title: m.rejectedName,
      description: m.rejectedIntroduction,
    }),
  ],
})
