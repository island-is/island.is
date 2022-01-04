import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Application: Form = buildForm({
  id: 'ApprovedApplicationForm',
  title: 'Samþykkt',
  children: [
    buildDescriptionField({
      id: 'approved',
      title: 'Til hamingju!',
      description: 'Umsókn þín hefur verið samþykkt!',
    }),
  ],
})
