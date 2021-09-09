import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { application, conclusion, section } from '../lib/messages'

export const PaymentPlanSubmittedForm: Form = buildForm({
  id: 'PaymentPlanSubmittedForm',
  title: application.name,
  mode: FormModes.PENDING,
  children: [
    buildSection({
      id: 'stepOne',
      title: section.confirmation,
      children: [
        buildCustomField({
          id: 'conclusion',
          title: conclusion.general.title,
          component: 'FormConclusion',
        }),
      ],
    }),
  ],
})
