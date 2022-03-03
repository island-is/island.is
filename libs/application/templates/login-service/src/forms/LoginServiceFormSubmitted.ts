import {
  buildCustomField,
  buildForm,
  Form,
  FormModes,
} from '@island.is/application/core'

import { application, submitted } from '../lib/messages'

export const LoginServiceFormSubmitted: Form = buildForm({
  id: 'LoginServiceFormSubmitted',
  title: application.name,
  mode: FormModes.APPROVED,
  children: [
    buildCustomField({
      id: 'submittedCustomField',
      title: submitted.general.pageTitle,
      component: 'Submitted',
    }),
  ],
})
