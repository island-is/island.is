import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const EndorsementApproved: Form = buildForm({
  id: 'endorsementFinal',
  title: m.endorsementApproved.title,
  mode: FormModes.APPROVED,
  children: [
    buildCustomField({
      id: 'endorsementApproved',
      title: m.endorsementApproved.title,
      component: 'EndorsementApproved',
    }),
  ],
})
