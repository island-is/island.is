import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  name: 'Samþykkt',
  mode: FormModes.APPROVED,
  children: [
    buildDescriptionField({
      id: 'approved',
      name: 'Til hamingju!',
      description: 'Umsókn þín hefur verið samþykkt!',
    }),
  ],
})
