import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const EndorsementApproved: Form = buildForm({
  id: 'endorsementFinal',
  title: m.endorsementApproved.title,
  logo: Logo,
  mode: FormModes.APPROVED,
  children: [
    buildCustomField({
      id: 'endorsementApproved',
      title: m.endorsementApproved.title,
      component: 'EndorsementApproved',
    }),
  ],
})
