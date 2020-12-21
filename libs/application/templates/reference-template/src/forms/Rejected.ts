import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Rejected: Form = buildForm({
  id: 'ExampleRejected',
  name: 'Hafnað',
  mode: FormModes.REJECTED,
  children: [
    buildDescriptionField({
      id: 'rejected',
      name: 'Því miður...',
      description: 'Umsókn þinni verið hafnað! Það er frekar leiðinlegt.',
    }),
  ],
})
