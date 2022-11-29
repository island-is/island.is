import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { application, conclusion, section } from '../lib/messages'

export const PaymentPlanSubmittedForm: Form = buildForm({
  id: 'PaymentPlanSubmittedForm',
  title: application.name,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'confirmation',
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
