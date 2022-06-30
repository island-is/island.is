import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'
import Logo from '../assets/Logo'

export const HealthInsuranceConfirmation: Form = buildForm({
  id: 'HealthInsuranceConfirmation',
  title: m.formTitle,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'confirmation',
      title: '',
      children: [
        buildCustomField({
          id: 'successfulSubmission',
          title: '',
          component: 'ConfirmationScreen',
        }),
      ],
    }),
  ],
})
