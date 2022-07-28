import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

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
