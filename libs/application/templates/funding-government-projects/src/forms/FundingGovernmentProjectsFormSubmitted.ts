import {
  buildCustomField,
  buildForm,
  Form,
  FormModes,
} from '@island.is/application/core'

import { application, submitted } from '../lib/messages'

export const FundingGovernmentProjectsFormSubmitted: Form = buildForm({
  id: 'FundingGovernmentProjectsFormSubmitted',
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
