import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
} from '@island.is/application/core'
import { section, application } from '../lib/messages'

export const LoginServiceForm: Form = buildForm({
  id: 'LoginServiceForm',
  title: application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'stepOne',
      title: section.stepOne,
      children: [
        buildDescriptionField({
          id: 'confirmationCustomField',
          title: application.name,
          description: 'Umsókn',
        }),
      ],
    }),
  ],
})
