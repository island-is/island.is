import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  title: 'Samþykkt',
  mode: FormModes.APPLYING,
  children: [
    buildCustomField({
      id: 'approved',
      component: 'Congratulations',
      title: 'Móttekið',
    }),
  ],
})
