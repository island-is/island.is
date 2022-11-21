import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from './messages'
import Logo from '../assets/Logo'

export const HealthInsuranceConfirmation: Form = buildForm({
  id: 'HealthInsuranceConfirmation',
  title: m.formTitle,
  logo: Logo,
  mode: FormModes.COMPLETED,
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
