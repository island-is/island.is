import {
  buildForm,
  buildSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './examplemessages'

export const HealthInsuranceForm: Form = buildForm({
  id: 'HealthInsuranceDraft',
  name: 'HealthInsurance',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'personalData',
      name: '',
      children: [
        buildTextField({
          id: 'personalDataText',
          name: 'text input',
        }),
      ],
    }),
    buildSection({
      id: 'occupation',
      name: '',
      children: [
        buildTextField({
          id: 'occupationText',
          name: 'text input',
        }),
      ],
    }),
    buildSection({
      id: 'info',
      name: '',
      children: [
        buildTextField({
          id: 'occupationText',
          name: 'text input',
        }),
      ],
    }),
    buildSection({
      id: 'summary',
      name: '',
      children: [
        buildTextField({
          id: 'occupationText',
          name: 'text input',
        }),
      ],
    }),
  ],
})
