import {
  ApplicationTypes,
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const Approved: Form = buildForm({
  id: ApplicationTypes.META_APPLICATION,
  name: m.approved,
  mode: FormModes.APPROVED,
  children: [
    buildDescriptionField({
      id: 'approved',
      name: m.approvedName,
      description: m.approvedIntroduction,
    }),
  ],
})
