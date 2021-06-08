import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  title: m.applicationApproved.title,
  logo: Logo,
  mode: FormModes.APPROVED,
  children: [
    buildCustomField({
      id: 'applicationApproved',
      title: m.applicationApproved.title,
      component: 'PartyApplicationApproved',
    }),
  ],
})
