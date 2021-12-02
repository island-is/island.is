import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildCustomField,
  Form,
  FormModes,
  buildSection,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const ApprovedExpired: Form = buildForm({
  id: 'ApprovedExpiredApplicationForm',
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
      title: m.payment,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [
        buildCustomField(
          {
            component: 'ConfirmationField',
            id: 'confirmationField',
            title: '',
            description: '',
          },
          {
            isExpired: true,
          },
        ),
      ],
    }),
  ],
})
