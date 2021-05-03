import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
} from '@island.is/application/core'
import { section, application } from '../lib/messages'

export const FundingGovernmentProjectsFormInReview: Form = buildForm({
  id: 'FundingGovernmentProjectsFormInReview',
  title: section.stepOne.pageTitle,
  mode: FormModes.PENDING,
  children: [
    buildSection({
      id: 'stepOne',
      title: section.stepOne.pageTitle,
      children: [
        buildDescriptionField({
          id: 'confirmationCustomField',
          title: application.general.name,
          description: 'In Review',
        }),
      ],
    }),
  ],
})
