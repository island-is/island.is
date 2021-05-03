import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
} from '@island.is/application/core'
import { section, application } from '../lib/messages'

export const FundingGovernmentProjectsForm: Form = buildForm({
  id: 'FundingGovernmentProjectsForm',
  title: application.general.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'stepOne',
      title: section.stepOne.pageTitle,
      children: [
        buildDescriptionField({
          id: 'confirmationCustomField',
          title: application.general.name,
          description: 'Umsókn',
        }),
      ],
    }),
  ],
})
