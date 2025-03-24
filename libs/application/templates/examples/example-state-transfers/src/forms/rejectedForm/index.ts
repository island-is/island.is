import {
  buildDescriptionField,
  buildForm,
  buildSection,
} from '@island.is/application/core'

export const RejectedForm = buildForm({
  id: 'RejectedForm',
  title: 'Hafnað',
  children: [
    buildSection({
      id: 'rejectedSection',
      title: 'Rejected',
      children: [
        buildDescriptionField({
          id: 'rejectedDescription',
          title: 'Rejected',
          description: 'This application was rejected',
        }),
      ],
    }),
  ],
})
