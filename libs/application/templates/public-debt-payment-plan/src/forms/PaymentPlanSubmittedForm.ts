import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
} from '@island.is/application/core'
import { section, application } from '../lib/messages'

export const PaymentPlanSubmittedForm: Form = buildForm({
  id: 'PaymentPlanSubmittedForm',
  title: application.name,
  mode: FormModes.APPROVED,
  children: [
    buildSection({
      id: 'stepOne',
      title: section.stepOne,
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
