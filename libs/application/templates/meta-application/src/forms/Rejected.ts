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
  name: m.rejected,
  mode: FormModes.REJECTED,
  children: [
    buildDescriptionField({
      id: 'rejected',
      name: m.rejectedName,
      description: m.rejectedIntroduction,
    }),
  ],
})
