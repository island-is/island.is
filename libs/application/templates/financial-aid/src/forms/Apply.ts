import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Apply: Form = buildForm({
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
