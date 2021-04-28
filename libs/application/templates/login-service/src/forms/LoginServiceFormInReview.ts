import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
} from '@island.is/application/core'
import { section, application } from '../lib/messages'

export const LoginServiceFormInReview: Form = buildForm({
  id: 'LoginServiceFormInReview',
  title: application.name,
  mode: FormModes.PENDING,
  children: [
    buildSection({
      id: 'stepOne',
      title: section.submitted,
      children: [
        buildDescriptionField({
          id: 'confirmationCustomField',
          title: application.name,
          description: 'In Review',
        }),
      ],
    }),
  ],
})
