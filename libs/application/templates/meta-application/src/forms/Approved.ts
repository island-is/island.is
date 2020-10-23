import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const Approved: Form = buildForm({
  id: ApplicationTypes.META_APPLICATION,
  name: m.approved,
  mode: FormModes.APPROVED,
  children: [
    buildIntroductionField({
      id: 'approved',
      name: m.approvedName,
      introduction: m.approvedIntroduction,
    }),
  ],
})
