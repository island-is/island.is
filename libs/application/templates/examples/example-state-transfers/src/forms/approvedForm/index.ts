import {
  buildDescriptionField,
  buildForm,
  buildSection,
} from '@island.is/application/core'

export const ApprovedForm = buildForm({
  id: 'ApprovedForm',
  title: 'Approved',
  children: [
    buildSection({
      id: 'approvedSection',
      title: 'Samþykkt',
      children: [
        buildDescriptionField({
          id: 'approvedDescription',
          title: 'Approved',
          description: 'This application was approved',
        }),
      ],
    }),
  ],
})
