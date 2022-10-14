import {
  buildForm,
  buildCustomField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messagesx'
import Logo from '../assets/Logo'
import { payment } from '../lib/messages'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [
        buildCustomField({
          component: 'ConfirmationField',
          id: 'confirmationField',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
